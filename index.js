#!/usr/bin/env node
'use strict';

const {format} = require('util');
const {shell} = require('execa');
const meow = require('meow');
const {
  allPass, always, apply, complement, defaultTo, equals, filter, fromPairs, ifElse, is, isEmpty, isNil, pipe, toPairs
} = require('ramda');
const {create, env} = require('sanctuary');

const {fromEither} = create({checkTypes: false, env});

const name = 'lope';
const cli = meow(`
Usage:
  $ ${name} <package> <script> [--global|-g] [--* <*>]

Options:
  --global, -g   Indicates the package is installed globally, not locally

Examples:
  $ ${name} lope-example true
  $ ${name} lope-example false
  $ ${name} lope-example echo --echo hello
`, {alias: {g: 'global'}});

const pkg = cli.input[0];
const script = cli.input[1];
const global = defaultTo(false, cli.flags.global);

const isNotEmpty = complement(isEmpty);
const isNotNil = complement(isNil);

const validOption = allPass([
	isNotNil,
	isNotEmpty,
	is(String)
]);
const validPackage = validOption;
const validScript = validOption;

const filterFlags = pipe(
  toPairs,
  filter(apply(key => !(key === '_' || key === 'g' || key === 'global'))),
  fromPairs
);

if (!validPackage(pkg) || !validScript(script)) {
	cli.showHelp(2);
}

const exec = async (pkg, script, options, global) => {
	const npmRootCmd = ifElse(equals(true), always('npm root -g'), always('npm root'))(global);
	const npmRoot = (await shell(npmRootCmd)).stdout;
	const lope = require('lope')(shell, npmRoot);

	return fromEither(null)(lope(pkg, script, options));
};

exec(pkg, script, filterFlags(require('minimist')(process.argv.slice(4))), global)
	.then(result => {
    /* istanbul ignore next */
		process.stdout.write(result.stdout ? (format(result.stdout) + '\n') : '');
    /* istanbul ignore next */
		process.stderr.write(result.stderr ? (format(result.stderr) + '\n') : '');
		process.exit(0);
	})
	.catch(err => {
    /* istanbul ignore next */
		process.stdout.write(err.stdout ? (format(err.stdout) + '\n') : '');
    /* istanbul ignore next */
		process.stderr.write(err.stderr ? (format(err.stderr) + '\n') : '');
		process.exit(err.code);
	});
