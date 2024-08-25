import * as vscode from 'vscode';
import { generateStructureCommand } from './commands/generateStructure';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.pstruc_extension', generateStructureCommand);
    context.subscriptions.push(disposable);
}

export function deactivate() {}
