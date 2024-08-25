import * as fs from 'fs';
import * as path from 'path';

export async function replaceDirectoryWithFiles(dirPath: string, items: string[]) {
    const stats = fs.statSync(dirPath);
    if (stats.isDirectory()) {
        const entries = fs.readdirSync(dirPath);
        for (const entry of entries) {
            const entryPath = path.join(dirPath, entry);
            await replaceDirectoryWithFiles(entryPath, items);
        }
    } else {
        items.push(dirPath);
    }
}

export function sortItems(filePaths: string[], workspaceFolder: string): string[] {
    return filePaths.sort((a, b) => {
        const aPath = path.relative(workspaceFolder, a);
        const bPath = path.relative(workspaceFolder, b);
        const aIsDir = fs.statSync(a).isDirectory();
        const bIsDir = fs.statSync(b).isDirectory();

        if (aIsDir && !bIsDir) return 1;
        if (!aIsDir && bIsDir) return -1;

        return aPath.localeCompare(bPath);
    });
}
