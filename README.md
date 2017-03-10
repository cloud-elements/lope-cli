# lope-cli <sub><sup>| Third-party NPM package scripts as simple CLIs<sup></sub>
[![version](http://img.shields.io/badge/version-0.0.0-blue.svg)](https://www.npmjs.com/package/@cloudelements/lope-cli)
[![versioning](http://img.shields.io/badge/versioning-semver-blue.svg)](http://semver.org/)
[![branching](http://img.shields.io/badge/branching-github%20flow-blue.svg)](https://guides.github.com/introduction/flow/)
[![styling](http://img.shields.io/badge/styling-xo-blue.svg)](https://github.com/sindresorhus/xo)
[![paradigm](http://img.shields.io/badge/paradigm-functional-blue.svg)](https://en.wikipedia.org/wiki/Functional_programming)
[![build](https://circleci.com/gh/cloud-elements/lope-cli.svg?style=shield)](https://circleci.com/gh/cloud-elements/lope-cli)

## Install
```bash
$ npm install --global lope-cli
```

## Usage
```bash
$ lope --help
Third-party NPM package scripts as simple CLIs

Usage:
  $ lope <lope-package> <lope-script> [--lope-path path] [--* <*>]

Options:
  --lope-package  The package to run against (default: undefined)
  --lope-path     The path containing the package in node_modules (default: current directory or the
                  nearest ancestor node_modules directory)
  --lope-script	  The script to run (default: undefined)

Examples:
  $ lope lope-example test
  $ lope lope-example echo --echo hello
```

## Maintainers
* Rocky Madden ([@rockymadden](https://github.com/rockymadden))
