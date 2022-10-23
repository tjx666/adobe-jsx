import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import consola from 'consola';

import { PhotoshopExecutor } from './executors/photoshop';
import { exec, pathExists, writeToStdout } from './utils.js';
import { ErrorCode } from './errorCode';
import { fileURLToPath } from 'node:url';

const moduleFilePath = fileURLToPath(import.meta.url);

interface EvalOptions {
    disableStdout?: boolean;
}

export async function evalJsxScript(script: string, options?: EvalOptions) {
    // create folder to storage all scripts related to this package
    const storageDir = path.resolve(os.homedir(), '.adobe_jsx');
    if (!(await pathExists(storageDir))) {
        await fs.mkdir(storageDir);
    }

    // clear output
    const jsxOutputPath = path.resolve(storageDir, './jsx_output.txt');
    await fs.writeFile(jsxOutputPath, '', { encoding: 'utf-8' });

    const psExecutor = new PhotoshopExecutor();
    const ps = await psExecutor.findApp();
    if (!ps) {
        consola.error(`Can't find the adobe application to execute jsx`);
        process.exit(ErrorCode.APPLICATION_NOT_FOUND);
    }

    const preloadJsxScriptPath = path.resolve(moduleFilePath, '../../JSX/preload.jsx');
    const preloadScript = await fs.readFile(preloadJsxScriptPath, { encoding: 'utf-8' });
    const finalJsxScript = `${preloadScript}
${script}
`;

    const appleScript = psExecutor.createOsascript(ps, finalJsxScript);
    const appleScriptPath = path.resolve(storageDir, 'eval_jsx.scpt');
    await fs.writeFile(appleScriptPath, appleScript, { encoding: 'utf-8' });

    await exec(`osascript '${appleScriptPath}'`);

    let output = await fs.readFile(jsxOutputPath, { encoding: 'utf-8' });
    // !: In photoshop, if you write \n, will be replaced to \r automatically, so we need to fix this here.
    output = output.replaceAll(/\r(?!\n)/gm, '\n');
    await writeToStdout(output);

    if (!options?.disableStdout) {
        console.log(output);
    }
    return output;
}

export async function evalJsxFile(jsxPath?: string, options?: EvalOptions) {
    jsxPath ??= path.resolve(process.cwd(), process.argv[2]);
    if (!(await pathExists(jsxPath))) {
        consola.error(`The path of jsx script doesn't exists: ${jsxPath}`);
        process.exit(ErrorCode.JSX_PATH_NOT_EXISTS);
    }

    return evalJsxScript(await fs.readFile(jsxPath, { encoding: 'utf-8' }), options);
}

const isDirectlyEvalByNode = moduleFilePath === process.argv[1];
if (isDirectlyEvalByNode) {
    evalJsxFile();
}
