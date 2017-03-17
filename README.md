# lope-cli <sub><sup>| Transform NPM package scripts into simple CLIs<sup></sub>
[![version](http://img.shields.io/badge/version-0.2.0-blue.svg)](https://www.npmjs.com/package/lope-cli)
[![versioning](http://img.shields.io/badge/versioning-semver-blue.svg)](http://semver.org/)
[![branching](http://img.shields.io/badge/branching-github%20flow-blue.svg)](https://guides.github.com/introduction/flow/)
[![styling](http://img.shields.io/badge/styling-xo-blue.svg)](https://github.com/sindresorhus/xo)
[![paradigm](http://img.shields.io/badge/paradigm-functional-blue.svg)](https://en.wikipedia.org/wiki/Functional_programming)
[![build](https://circleci.com/gh/cloud-elements/lope-cli.svg?style=shield)](https://circleci.com/gh/cloud-elements/lope-cli)

Transform NPM package scripts into simple CLIs. Optionally, tap into
[NPM configs](http://www.marcusoft.net/2015/08/npm-scripting-configs-and-arguments.html) to pass options to said
scripts. Check out [lope-example](https://github.com/cloud-elements/lope-example/blob/master/package.json) for
a basic `package.json` example.

## Install
```bash
$ npm install --global lope-cli
```

## Usage
### Against local package via the command line:
```bash
$ npm install lope-example
$ lope lope-example test
$ lope lope-example echo --echo hello
hello
```

### Against local package, leveraging `npm config`, via the command line:
```bash
$ npm install lope-example
$ npm config set lope-example:echo hello
$ lope lope-example test
$ lope lope-example echo
hello
```

### Against local package via NPM script:
```json
{
  "devDependencies": {
    "lope-cli": "0.0.x",
    "lope-example": "0.0.x"
  },
  "scripts": {
    "echo": "lope lope-example echo --echo hello",
    "test": "lope lope-example test"
  }
}
```

```bash
$ npm run test
$ npm run echo
hello
```

### Against global package via the command line:
```bash
$ npm install --global lope-example
$ lope lope-example test --global
$ lope lope-example echo --echo hello --global
hello
```

### Against global package, leveraging `npm config`, via the command line:
```bash
$ npm install --global lope-example
$ npm config set lope-example:echo hello
$ lope lope-example test --global
$ lope lope-example echo --global
hello
```

### Against self-referencing package via the command line:
```json
{
  "scripts": {
    "echo": "echo ${npm_package_config_echo}",
    "test": "true"
  }
}
```

```bash
$ lope test
$ lope echo --echo hello
hello
```

### Against self-referencing package via NPM script:
```json
{
  "devDependencies": {
    "lope-cli": "0.0.x"
  },
  "scripts": {
    "echo": "echo ${npm_package_config_echo}",
    "echo2": "lope echo --echo hello"
  }
}
```

```bash
$ npm run echo2
hello
```

## Maintainers
* Rocky Madden ([@rockymadden](https://github.com/rockymadden))
