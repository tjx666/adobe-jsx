import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import consola from 'consola';

import { PhotoshopExecutor } from './executors/photoshop';
import { exec, pathExists, writeToStdout } from './utils.js';
import { ErrorCode, EvalJsxError } from './EvalJsxError';
import { fileURLToPath } from 'node:url';

interface EvalOptions {
    disableStdout?: boolean;
}

interface EvalResult {
    stdout: string;
    value: any;
    errorStr: string;
}

const moduleFilePath = fileURLToPath(import.meta.url);

// create folder to storage all scripts related to this package
const storageDir = path.resolve(os.homedir(), '.adobe_jsx');
async function ensurePaths() {
    if (!(await pathExists(storageDir))) {
        await fs.mkdir(storageDir);
    }
}

function fixEOF(jsxString: string): string {
    return jsxString.replaceAll(/\r(?!\n)/gm, '\n');
}

export async function evalJsxScript(script: string, options?: EvalOptions): Promise<EvalResult> {
    await ensurePaths();
    const scriptPath = path.resolve(storageDir, 'eval_script.jsx');
    await fs.writeFile(scriptPath, script, { encoding: 'utf-8' });
    return evalJsxFile(scriptPath, options);
}

export async function evalJsxFile(jsxPath?: string, options?: EvalOptions): Promise<EvalResult> {
    jsxPath ??= path.resolve(process.cwd(), process.argv[2]);
    if (!(await pathExists(jsxPath))) {
        throw new EvalJsxError(
            `The path of jsx script doesn't exists: ${jsxPath}`,
            ErrorCode.JSX_PATH_NOT_EXISTS,
        );
    }

    await ensurePaths();

    // clear output
    const jsxOutputPath = path.resolve(storageDir, './jsx_output.txt');
    const resultPath = path.resolve(storageDir, '.jsx_result.json');
    const errorPath = path.resolve(storageDir, '.jsx_error.json');
    await Promise.all([
        await fs.writeFile(jsxOutputPath, '', { encoding: 'utf-8' }),
        await fs.writeFile(resultPath, '', { encoding: 'utf-8' }),
        await fs.writeFile(errorPath, '', { encoding: 'utf-8' }),
    ]);

    const psExecutor = new PhotoshopExecutor();
    const ps = await psExecutor.findApp();
    if (!ps) {
        throw new EvalJsxError(
            `Can't find the adobe application to execute jsx`,
            ErrorCode.APPLICATION_NOT_FOUND,
        );
    }

    const bootJsxScriptPath = path.resolve(moduleFilePath, '../../JSX/index.jsx');
    const script = `$.__eval_file_path__ = '''${jsxPath}''';
$.evalFile('''${bootJsxScriptPath}''');
`;
    const appleScript = psExecutor.createOsascript(ps, script);
    const appleScriptPath = path.resolve(storageDir, 'eval_jsx.scpt');
    await fs.writeFile(appleScriptPath, appleScript, { encoding: 'utf-8' });

    await exec(`osascript '${appleScriptPath}'`);

    let output = await fs.readFile(jsxOutputPath, { encoding: 'utf-8' });
    // !: In photoshop, if you write \n, will be replaced to \r automatically, so we need to fix this here.
    output = fixEOF(output);
    if (!options?.disableStdout) {
        await writeToStdout(output);
    }

    const errorStr = fixEOF(await fs.readFile(errorPath, { encoding: 'utf-8' }));
    if (errorStr.trim() !== '') {
        throw new EvalJsxError(errorStr, ErrorCode.EVAL_FAILED);
    }

    const result = await fs.readFile(resultPath, { encoding: 'utf-8' });
    writeToStdout(result);

    return {
        stdout: output,
        value: result,
        errorStr: errorStr,
    };
}

const isDirectlyEvalByNode = moduleFilePath === process.argv[1];
if (isDirectlyEvalByNode) {
    evalJsxFile();
}
