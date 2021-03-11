<h1 align="center">Welcome to rollup-entrypoint-generator</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D10-blue.svg" />
  <a href="https://github.com/mbernardeau/rollup-entrypoint-generator#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/mbernardeau/rollup-entrypoint-generator/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/mbernardeau/rollup-entrypoint-generator/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/mbernardeau/rollup-entrypoint-generator" />
  </a>
</p>

> Entry point generator based on code for rollup

## Prerequisites

- node >=10

## Install

```sh
npm install rollup-entrypoint-generator --save-dev
```

## Why

With Rollup, it is easy to create a tree-shakable library using multiple entrypoints. Each entrypoint is a module that can be imported without the others.

The build process can generate a file per entry point, allowing tree shake by default for library consumers.

The downside is that we need to maintain a list of entrypoints. This lib helps automating this task.

## How it works

Find every export of the style `export { default as ComponentName } from 'componentPath'`. Each one of them with generate an entry point with the name `ComponentName`.

## Usage

```js
// rollup.config.js
const { generateEntryPoints } = require('rollup-entrypoint-generator')

export default generateEntryPoints('./src').then(input => ({
  input,
  // ...rest of your rollup config
})
```

## Configuration

`generateEntryPoints` accepts an object containing configuration keys as a second parameter.

**Example**:

```js
// rollup.config.js
const { generateEntryPoints } = require('rollup-entrypoint-generator')

export default generateEntryPoints('./src', { extensions: ['js'] }).then(input => ({
  input,
  // ...rest of your rollup config
})
```

### Accepted configuration

#### Extensions

By default, this module only searches for files ending with `.js`, `.jsx` or `.json` when trying a configuration path. You can add an `extensions` array to override this default.

Note that adding extensions assumes the corresponding loader is correctly configured in Rollup.

```js
// rollup.config.js
const { generateEntryPoints } = require('rollup-entrypoint-generator')

// Allow svg, js, jsx as entrypoints
export default generateEntryPoints('./src', { extensions: ['js', 'jsx', 'svg'] }).then(input => ({
  input,
  // ...rest of your rollup config
})
```

#### EcmaVersion

Defines the ECMAScript version to parse. See [acorn's documentation](https://github.com/acornjs/acorn/blob/master/acorn/README.md#interface) for possible values. Defaults to `2020`.

## Author

👤 **Mathias Bernardeau**

- Github: [@mbernardeau](https://github.com/mbernardeau)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/mbernardeau/rollup-entrypoint-generator/issues). You can also take a look at the [contributing guide](https://github.com/mbernardeau/rollup-entrypoint-generator/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Mathias Bernardeau](https://github.com/mbernardeau).<br />
This project is [MIT](https://github.com/mbernardeau/rollup-entrypoint-generator/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
