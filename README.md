# adobe jsx

[![npm version](https://img.shields.io/npm/v/adobe-jsx.svg)](https://www.npmjs.com/package/adobe-jsx) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/adobe-jsx) ![npm](https://img.shields.io/npm/dm/adobe-jsx) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://github.com/tjx666/adobe-jsx/pulls)

command line tool to execute adobe extendscript `.jsx` file

## Install

```sh
# npm
npm i -g adobe-jsx

# pnpm
pnpm i -g adobe-jsx
```

## Usage

### command line

After installation, you can use command `jsx` to execute the jsx script.

```sh
jsx /path/to/jsxScript.jsx
```

### node api

```typescript
import { evalJsxFile, evalJsxScript } from '../src/jsx';

evalJsxScript(`alert('hello world')`);

async function main() {
    const output = await evalJsxScript(`$write('666')`);
    console.log();
}
```

## TODO

- [x] tests
- [x] support `$.write/$.writeln` redirect to stdout
- [ ] get eval JSX result and error
- [ ] support access `jsx` command arguments
- [ ] support specify adobe app and version
- [ ] provide node api to execute jsx
- [ ] support AE
- [ ] support windows
