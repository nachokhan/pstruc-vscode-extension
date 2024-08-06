import * as vscode from 'vscode';
import { PstrucCommand } from './file_structure/PstrucCommand';

export function activate(context: vscode.ExtensionContext) {
  const pstrucCommand = new PstrucCommand();
  const disposable = vscode.commands.registerCommand('extension.pstruc_extension', pstrucCommand.execute);

  context.subscriptions.push(disposable);
}

export function deactivate() {}
