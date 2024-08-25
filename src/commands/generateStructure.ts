import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import * as YAML from 'js-yaml';
import { preprocessItems, processItem } from '../utils/structureUtils';
import { getSettings } from '../config/settings';
import { getWorkspaceFolder, getSelectedUris } from '../vscode/vscodeUtils';

export async function generateStructureCommand(uri: vscode.Uri, uris: vscode.Uri[]) {
    const workspaceFolder = getWorkspaceFolder();
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace open');
        return;
    }

    const filePaths = getSelectedUris(uris);
    const { ignorePatterns, hideBinaryContent, outputFormat } = getSettings();

    let items = await preprocessItems(filePaths, workspaceFolder, ignorePatterns);

    const structure: any = {};
    for (const item of items) {
        const relativePath = path.relative(workspaceFolder, item);
        await processItem(item, relativePath.split(path.sep), structure, hideBinaryContent);
    }

    const structureFilePath = path.join(workspaceFolder, `structure.${outputFormat}`);
    if (outputFormat === 'json') {
        fs.writeFileSync(structureFilePath, JSON.stringify(structure, null, 2));
    } else if (outputFormat === 'pdf') {
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(structureFilePath));
        doc.text(JSON.stringify(structure, null, 2));
        doc.end();
    } else if (outputFormat === 'yaml') {
        fs.writeFileSync(structureFilePath, YAML.dump(structure));
    }

    vscode.window.showInformationMessage(`Structure file created at: ${structureFilePath}`);
}
