#!/usr/bin/env node
'use strict';

const {join} = require('path');
const {shell} = require('execa');
const lope = require('lope');
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
  $ ${name} [package] <script> [--* <*>]

Options:
  --global, -g  Indicates package is installed globally

Examples:
  $ # Run the test script against current package
  $ ${name} test

  $ # Run the test script against local package
  $ ${name} lope-example test

  $ # Run the test script against global package
  $ ${name} lope-example test --global

  $ # Run the echo script, with options, against current package
  $ ${name} echo --echo hello

  $ # Run the echo script, with options, against local package
  $ ${name} lope-example echo --echo hello

  $ # Run the echo script, with options, against global package
  $ ${name} lope-example echo --echo hello --global
`, {alias: {g: 'global'}});

const pkg = ifElse(pipe(length, equals(1)), always(null), nth(0))(cli.input);
const script = ifElse(pipe(length, equals(2)), nth(1), nth(0))(cli.input);
const options = minimist(process.argv.slice(2 + length(cli.input)));
const glb = defaultTo(false, cli.flags.global);

const isNotEmpty = complement(isEmpty);
const isNotNil = complement(isNil);

const validOption = allPass([isNotNil, isNotEmpty, is(String)]);
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

const run = async (pkg, script, options, glb) => {
	const rootCmd = cond([
		[pipe(nthArg(0), isNil), always('npm prefix')],
		[pipe(nthArg(1), equals(true)), always('npm root -g')],
		[T, always('npm root')]
	])(pkg, glb);
	const root = (await shell(rootCmd)).stdout;
	const pack = ifElse(
		isNil,
		() => require(join(process.cwd(), 'package.json')).name,
		identity
	)(pkg);

	return fromEither(null)(lope(root, pack, script, options));
};

run(pkg, script, filterFlags(options), glb)
	.then(() => process.exit(0))
	.catch(err => process.exit(err.code));
