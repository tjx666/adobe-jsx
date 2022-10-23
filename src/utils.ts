import { constants as FS_CONSTANTS } from 'node:fs';
import fs from 'node:fs/promises';
import childProcess from 'node:child_process';
import { promisify } from 'node:util';

export function escapeStringAppleScript(string: string) {
    return string.replace(/[\\"]/g, '\\$&');
}

export function pathExists(path: string) {
    return fs
        .access(path, FS_CONSTANTS.F_OK)
        .then(() => true)
        .catch(() => false);
}

export const exec = promisify(childProcess.exec);
export const writeToStdout = promisify(process.stdout.write.bind(process.stdout));
