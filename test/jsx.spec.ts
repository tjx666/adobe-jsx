import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from 'vitest';

import { evalJsxFile, evalJsxScript } from '../src/jsx';

const moduleFilePath = fileURLToPath(import.meta.url);

test(
    'eval jsx script',
    async () => {
        const script = `$.writeln('hello world')`;
        const output = await evalJsxScript(script, { disableStdout: true });
        expect(output).toBe('hello world\n');
    },
    {
        timeout: 1000,
    },
);

test(
    'eval jsx file',
    async () => {
        const scriptPath = path.resolve(moduleFilePath, '../fixtures/helloWorld.jsx');
        const output = await evalJsxFile(scriptPath, { disableStdout: true });
        expect(output).toBe('hello world\n');
    },
    {
        timeout: 1000,
    },
);
