import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class UriProcessor {
  constructor(private ignorePatterns: string[]) {}

  public async preprocessItems(uris: vscode.Uri[], workspaceFolder: string): Promise<vscode.Uri[]> {
    let items: vscode.Uri[] = [];
    for (const uri of uris) {
      await this.replaceDirectoryWithFiles(uri, items);
    }
    items = this.sortItems(items, workspaceFolder);
    items = this.filterIgnoredItems(items);
    return items;
  }

  private async replaceDirectoryWithFiles(uri: vscode.Uri, items: vscode.Uri[]) {
    const stats = fs.statSync(uri.fsPath);
    if (stats.isDirectory()) {
      const entries = fs.readdirSync(uri.fsPath);
      for (const entry of entries) {
        const entryPath = path.join(uri.fsPath, entry);
        await this.replaceDirectoryWithFiles(vscode.Uri.file(entryPath), items);
      }
    } else {
      items.push(uri);
    }
  }

  private sortItems(uris: vscode.Uri[], workspaceFolder: string): vscode.Uri[] {
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

  private filterIgnoredItems(uris: vscode.Uri[]): vscode.Uri[] {
    const regexPatterns = this.ignorePatterns.map(pattern => new RegExp(pattern.replace('.', '\\.').replace('*', '.*')));
    return uris.filter(uri => !regexPatterns.some(regex => regex.test(uri.fsPath)));
  }
}
