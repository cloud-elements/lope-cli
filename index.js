#!/usr/bin/env node
'use strict';

const {format} = require('util');
const {shell} = require('execa');
const meow = require('meow');
const minimist = require('minimist');
const {
	T, allPass, always, apply, complement, cond, defaultTo, either, equals, filter, fromPairs, identity, ifElse, is,
	isEmpty, isNil, length, nth, nthArg, pipe, toPairs
} = require('ramda');
const {create, env} = require('sanctuary');

const {fromEither} = create({checkTypes: false, env});

const name = 'lope';
const cli = meow(`
Usage:
  $ ${name} [package] <script> [--global|-g] [--* <*>]

Options:
  --global, -g  Indicates the package is installed globally

Examples:
  $ ${name} test
  $ ${name} lope-example test
  $ ${name} lope-example test --global
  $ ${name} echo --echo hello
  $ ${name} lope-example echo --echo hello
  $ ${name} lope-example echo --echo hello --global
`, {alias: {g: 'global'}});

const pkg = ifElse(
	pipe(length, equals(1)),
	always(null),
	nth(0)
)(cli.input);
const script = ifElse(
	pipe(length, equals(2)),
	nth(1),
	nth(0)
)(cli.input);
const options = minimist(process.argv.slice(2 + length(cli.input)));
const glb = defaultTo(false, cli.flags.global);

const isNotEmpty = complement(isEmpty);
const isNotNil = complement(isNil);

const validOption = allPass([
	isNotNil,
	isNotEmpty,
	is(String)
]);
const validPackage = either(isNil, validOption);
const validScript = validOption;

const filterFlags = pipe(
	toPairs,
	filter(apply(key => !(key === '_' || key === 'g' || key === 'global'))),
	fromPairs
);

if (!validPackage(pkg) || !validScript(script)) {
	cli.showHelp(2);
}

const exec = async (pkg, script, options, glb) => {
	const rootCmd = cond([
		[pipe(nthArg(0), isNil), always('cd $(npm root) && cd .. && pwd')],
		[pipe(nthArg(1), equals(true)), always('npm root -g')],
		[T, always('npm root')]
	])(pkg, glb);
	const root = (await shell(rootCmd)).stdout;
	const lope = require('lope')(shell);
	const pack = ifElse(
		isNil,
		() => require('./package').name,
		identity
	)(pkg);

	return fromEither(null)(lope(root, pack, script, options));
};

exec(pkg, script, filterFlags(options), glb)
	.then(result => {
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
