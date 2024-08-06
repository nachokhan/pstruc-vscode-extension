import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FileProcessor } from './FileProcessor';

export class PstrucCommand {
  public async execute(uri: vscode.Uri, uris: vscode.Uri[]) {
    if (!uris || uris.length === 0) {
      vscode.window.showErrorMessage('No files or folders selected');
      return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace open');
      return;
    }

    const config = vscode.workspace.getConfiguration('pstruc_extension');
    const ignorePatterns = config.get<string[]>('ignorePatterns', []);
    const hideBinaryContent = config.get<boolean>('hideBinaryContent', true);

    const fileProcessor = new FileProcessor(workspaceFolder, ignorePatterns, hideBinaryContent);
    const structure = await fileProcessor.process(uris);

    console.log('Resulting JSON structure:', JSON.stringify(structure, null, 2));

    const structureFilePath = path.join(workspaceFolder, 'structure.json');
    fs.writeFileSync(structureFilePath, JSON.stringify(structure, null, 2));
    vscode.window.showInformationMessage('Structure file created at: ' + structureFilePath);
  }
}
