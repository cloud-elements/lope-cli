#!/usr/bin/env node
'use strict';

const {join} = require('path');
const {shell} = require('execa');
const findup = require('findup-sync');
const meow = require('meow');
const {
	allPass, always, apply, complement, defaultTo, filter, ifElse, is, isEmpty, isNil, map, pipe, toPairs
} = require('ramda');

const name = 'lope';
const cli = meow(`
Usage:
  $ ${name} <lope-package> <lope-script> [--lope-path path] [--* <*>]

Options:
  --lope-package  The package to run against (default: undefined)
  --lope-path     The path containing the package in node_modules (default: current directory or the
                  nearest ancestor node_modules directory)
  --lope-script	  The script to run (default: undefined)

Examples:
  $ ${name} lope-example test
  $ ${name} lope-example echo --echo hello
`);

const pkg = defaultTo(cli.input[0], cli.flags.lopePackage);
const scr = defaultTo(cli.input[1], cli.flags.lopeScript);
const pth = cli.flags.lopePath;

const modules = pth ? findup('node_modules', {cwd: pth}) : findup('node_modules');

const isNotEmpty = complement(isEmpty);
const isNotNil = complement(isNil);

const validOption = allPass([
	isNotNil,
	isNotEmpty,
	is(String)
]);
const validArg = allPass([validOption, key => !key.startsWith('lope')]);
const validModules = validOption;
const validPackage = validOption;
const validScript = validOption;

const parseArg = (key, value) => `${key}:${value}`;

if (!validPackage(pkg) || !validScript(scr) || !validModules(modules)) {
	cli.showHelp(2);
}

const path = join(modules, pkg);
const argsArray = pipe(toPairs, filter(apply(validArg)), map(apply(parseArg)), as => as.join(' '))(cli.flags);
const argsString = ifElse(
	isEmpty,
	always(''),
	args => ` -- ${args}`
)(argsArray);
const cmd = `cd '${path}' && npm run ${scr}${argsString}`;

shell(cmd)
	.then(result => {
		process.stdout.write(result.stdout);
		process.exit(0);
	})
	.catch(err => {
		process.stdout.write(err.stdout);
		process.stderr.write(err.stderr);
		process.exit(err.code);
	});
