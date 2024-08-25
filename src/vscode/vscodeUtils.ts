import * as vscode from 'vscode';

export function getWorkspaceFolder(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

export function getSelectedUris(uris: vscode.Uri[]): string[] {
    return uris.map(uri => uri.fsPath);
}
