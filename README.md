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

## Usage

```js
// rollup.config.js
const { generateEntryPoints } = require('./generateEntryPoints')

export default generateEntryPoints('./src').then(input => ({
  input,
  // rest of your rollup config
})
```

TODO

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
