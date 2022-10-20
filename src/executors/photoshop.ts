import fs from 'node:fs/promises';

import { escapeStringAppleScript } from '../utils';
import { BaseExecutor } from './BaseExecutor';

export class PhotoshopExecutor extends BaseExecutor {
    /**
     * @returns for example: Adobe Photoshop 2022
     */
    async findApp() {
        const applicationsFolder = '/Applications';
        const appFoldersNames = await fs.readdir(applicationsFolder);
        const psFolderName = appFoldersNames.find((folderName) =>
            folderName.includes('Adobe Photoshop'),
        );
        return psFolderName;
    }

    createOsascript(app: string, script: string): string {
        return `tell application "${app}"
        do javascript "${escapeStringAppleScript(script)}"
    end tell`;
    }
}
