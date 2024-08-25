import * as fs from 'fs';
import * as path from 'path';
import { isBinaryFile } from 'isbinaryfile';
import { replaceDirectoryWithFiles, sortItems } from './fileUtils';

export async function preprocessItems(filePaths: string[], workspaceFolder: string, ignorePatterns: string[]): Promise<string[]> {
    let items: string[] = [];
    for (const filePath of filePaths) {
        await replaceDirectoryWithFiles(filePath, items);
    }
    items = sortItems(items, workspaceFolder);
    items = filterIgnoredItems(items, ignorePatterns);
    return items;
}

function filterIgnoredItems(filePaths: string[], patterns: string[]): string[] {
    const regexPatterns = patterns.map(pattern => new RegExp(pattern.replace('.', '\\\\.').replace('*', '.*')));
    return filePaths.filter(filePath => !regexPatterns.some(regex => regex.test(filePath)));
}

export async function processItem(filePath: string, pathParts: string[], structure: any, hideBinaryContent: boolean) {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
        const entries = fs.readdirSync(filePath);
        for (const entry of entries) {
            const entryPath = path.join(filePath, entry);
            const entryRelativePathParts = [...pathParts, entry];
            await processItem(entryPath, entryRelativePathParts, structure, hideBinaryContent);
        }
    } else {
        await addFileToStructure(structure, filePath, pathParts, hideBinaryContent);
    }
}

async function addFileToStructure(structure: any, filePath: string, pathParts: string[], hideBinaryContent: boolean) {
    const name = pathParts.shift()!;
    if (pathParts.length === 0) {
        let content;
        if (hideBinaryContent && await isBinaryFile(filePath)) {
            content = '(binary)';
        } else {
            content = fs.readFileSync(filePath, 'utf-8');
        }
        structure[name] = content;
    } else {
        if (!structure[name]) {
            structure[name] = {};
        }
        await addFileToStructure(structure[name], filePath, pathParts, hideBinaryContent);
    }
}
