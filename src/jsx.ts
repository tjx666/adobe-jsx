import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import consola from 'consola';

import { PhotoshopExecutor } from './executors/photoshop';
import { exec, pathExists } from './utils.js';

// create folder to storage all scripts related to this package
const storageDir = path.resolve(os.homedir(), '.adobe_jsx');
if (!(await pathExists(storageDir))) {
    fs.mkdir(storageDir);
}

const jsxPath = path.resolve(process.cwd(), process.argv[2]);
const psExecutor = new PhotoshopExecutor();
const ps = await psExecutor.findApp();
if (!ps) {
    consola.error(`Can't find the adobe application to execute jsx file: ${jsxPath}`);
    process.exit(1);
}

const jsxContent = await fs.readFile(jsxPath, { encoding: 'utf-8' });
const appleScript = psExecutor.createOsascript(ps, jsxContent);
const appleScriptPath = path.resolve(storageDir, 'eval_jsx.scpt');
await fs.writeFile(appleScriptPath, appleScript, { encoding: 'utf-8' });

await exec(`osascript '${appleScriptPath}'`);