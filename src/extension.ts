import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.generateStructure', async (uri: vscode.Uri, uris: vscode.Uri[]) => {
    if (!uris || uris.length === 0) {
      vscode.window.showErrorMessage('No files or folders selected');
      return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace open');
      return;
    }

    // Get user-defined ignore patterns from settings
	let ignorePatterns = vscode.workspace.getConfiguration('generateStructure').get<string[]>('ignorePatterns', []);

	// Ensure ignorePatterns is an array
	if (!Array.isArray(ignorePatterns)) {
	ignorePatterns = [];
	}

	// Pre-process the selected items
    let items = await preprocessItems(uris, workspaceFolder, ignorePatterns);

    // Process the items to generate the structure
    const structure: any = {};

    for (const item of items) {
      const relativePath = path.relative(workspaceFolder, item.fsPath);
      await processItem(item.fsPath, relativePath.split(path.sep), structure);
    }

    console.log('Resulting JSON structure:', JSON.stringify(structure, null, 2));

    const structureFilePath = path.join(workspaceFolder, 'structure.json');
    fs.writeFileSync(structureFilePath, JSON.stringify(structure, null, 2));
    vscode.window.showInformationMessage('Structure file created at: ' + structureFilePath);
  });

  context.subscriptions.push(disposable);
}

async function preprocessItems(uris: vscode.Uri[], workspaceFolder: string, ignorePatterns: string[]): Promise<vscode.Uri[]> {
  let items: vscode.Uri[] = [];

  // Step 1: Replace directories with their files
  for (const uri of uris) {
    await replaceDirectoryWithFiles(uri, items);
  }

  // Step 2: Sort items by level, showing files first (alphabetically) and then directories (alphabetically)
  items = sortItems(items, workspaceFolder);

  // Step 3: Filter out items that match ignore patterns
  items = filterIgnoredItems(items, ignorePatterns);

  return items;
}

async function replaceDirectoryWithFiles(uri: vscode.Uri, items: vscode.Uri[]) {
  const stats = fs.statSync(uri.fsPath);
  if (stats.isDirectory()) {
    const entries = fs.readdirSync(uri.fsPath);
    for (const entry of entries) {
      const entryPath = path.join(uri.fsPath, entry);
      await replaceDirectoryWithFiles(vscode.Uri.file(entryPath), items);
    }
  } else {
    items.push(uri);
  }
}

function sortItems(uris: vscode.Uri[], workspaceFolder: string): vscode.Uri[] {
  return uris.sort((a, b) => {
    const aPath = path.relative(workspaceFolder, a.fsPath);
    const bPath = path.relative(workspaceFolder, b.fsPath);
    const aIsDir = fs.statSync(a.fsPath).isDirectory();
    const bIsDir = fs.statSync(b.fsPath).isDirectory();

    if (aIsDir && !bIsDir) return 1;
    if (!aIsDir && bIsDir) return -1;

    return aPath.localeCompare(bPath);
  });
}

function filterIgnoredItems(uris: vscode.Uri[], patterns: string[]): vscode.Uri[] {
  const regexPatterns = patterns.map(pattern => new RegExp(pattern.replace('*', '.*')));
  return uris.filter(uri => !regexPatterns.some(regex => regex.test(uri.fsPath)));
}

async function processItem(filePath: string, pathParts: string[], structure: any) {
  const stats = fs.statSync(filePath);
  if (stats.isDirectory()) {
    const entries = fs.readdirSync(filePath);
    for (const entry of entries) {
      const entryPath = path.join(filePath, entry);
      const entryRelativePathParts = [...pathParts, entry];
      await processItem(entryPath, entryRelativePathParts, structure);
    }
  } else {
    addFileToStructure(structure, filePath, pathParts);
  }
}

function addFileToStructure(structure: any, filePath: string, pathParts: string[]) {
  const name = pathParts.shift()!;
  if (pathParts.length === 0) {
    const content = fs.readFileSync(filePath, 'utf-8');
    structure[name] = content;
  } else {
    if (!structure[name]) {
      structure[name] = {};
    }
    addFileToStructure(structure[name], filePath, pathParts);
  }
}

export function deactivate() {}
