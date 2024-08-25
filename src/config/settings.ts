import * as vscode from 'vscode';

export function getSettings() {
    const ignorePatterns = vscode.workspace.getConfiguration('pstruc_extension').get<string[]>('ignorePatterns', []);
    const hideBinaryContent = vscode.workspace.getConfiguration('pstruc_extension').get<boolean>('hideBinaryContent', true);
    const outputFormat = vscode.workspace.getConfiguration('pstruc_extension').get<string>('outputFormat', 'json');
    
    return { ignorePatterns, hideBinaryContent, outputFormat };
}
