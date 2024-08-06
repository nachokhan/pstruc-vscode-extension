import * as vscode from 'vscode';
import { PstrucCommand } from './file_structure/PstrucCommand';
import { FileStructureProvider } from './ui/FileStructureProvider';
import { DBStructureProvider } from './ui/DBStructureProvider';

export function activate(context: vscode.ExtensionContext) {
  const pstrucCommand = new PstrucCommand();
  const disposable = vscode.commands.registerCommand('extension.pstruc_extension', pstrucCommand.execute);

  const fileStructureProvider = new FileStructureProvider();
  const dbStructureProvider = new DBStructureProvider();

  vscode.window.registerTreeDataProvider('fileStructureView', fileStructureProvider);
  vscode.window.registerTreeDataProvider('dbStructureView', dbStructureProvider);

  vscode.commands.registerCommand('fileStructure.renameFile', () => fileStructureProvider.renameFile());
  vscode.commands.registerCommand('fileStructure.toggleHideBinaryContent', () => fileStructureProvider.toggleHideBinaryContent());

  context.subscriptions.push(disposable);
  context.subscriptions.push(vscode.commands.registerCommand('fileStructure.renameFile', () => fileStructureProvider.renameFile()));
}

export function deactivate() {}
