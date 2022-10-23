import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import consola from 'consola';

import { PhotoshopExecutor } from './executors/photoshop';
import { exec, pathExists } from './utils.js';
import { ErrorCode } from './errorCode';
import { fileURLToPath } from 'node:url';

// create folder to storage all scripts related to this package
const storageDir = path.resolve(os.homedir(), '.adobe_jsx');
if (!(await pathExists(storageDir))) {
    await fs.mkdir(storageDir);
}

// clear output
const jsxOutputPath = path.resolve(storageDir, './jsx_output.txt');
await fs.writeFile(jsxOutputPath, '', { encoding: 'utf-8' });

const jsxPath = path.resolve(process.cwd(), process.argv[2]);
if (!(await pathExists(jsxPath))) {
    consola.error(`The path of jsx script doesn't exists: ${jsxPath}`);
    process.exit(ErrorCode.JSX_PATH_NOT_EXISTS);
}

const psExecutor = new PhotoshopExecutor();
const ps = await psExecutor.findApp();
if (!ps) {
    consola.error(`Can't find the adobe application to execute jsx file: ${jsxPath}`);
    process.exit(ErrorCode.APPLICATION_NOT_FOUND);
}

const preloadJsxScriptPath = path.resolve(fileURLToPath(import.meta.url), '../../JSX/preload.jsx');
const preloadScript = await fs.readFile(preloadJsxScriptPath, { encoding: 'utf-8' });

const jsxContent = await fs.readFile(jsxPath, { encoding: 'utf-8' });
const finalJsxScript = `${preloadScript}
${jsxContent}
`;

const appleScript = psExecutor.createOsascript(ps, finalJsxScript);
const appleScriptPath = path.resolve(storageDir, 'eval_jsx.scpt');
await fs.writeFile(appleScriptPath, appleScript, { encoding: 'utf-8' });

await exec(`osascript '${appleScriptPath}'`);

let output = await fs.readFile(jsxOutputPath, { encoding: 'utf-8' });
// !: In photoshop, if you write \n, will be replaced to \r automatically, so we need to fix this here.
output = output.replaceAll(/\r(?!\n)/gm, '\n');
process.stdout.write(output);
