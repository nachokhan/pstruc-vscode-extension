import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { isBinaryFile } from 'isbinaryfile';
import { UriProcessor } from './UriProcessor';

export class FileProcessor {
  constructor(private workspaceFolder: string, private ignorePatterns: string[], private hideBinaryContent: boolean) {}

  public async process(uris: vscode.Uri[]): Promise<any> {
    const uriProcessor = new UriProcessor(this.ignorePatterns);
    const items = await uriProcessor.preprocessItems(uris, this.workspaceFolder);

    const structure: any = {};
    for (const item of items) {
      const relativePath = path.relative(this.workspaceFolder, item.fsPath);
      await this.processItem(item.fsPath, relativePath.split(path.sep), structure);
    }
    return structure;
  }

  private async processItem(filePath: string, pathParts: string[], structure: any) {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const entries = fs.readdirSync(filePath);
      for (const entry of entries) {
        const entryPath = path.join(filePath, entry);
        const entryRelativePathParts = [...pathParts, entry];
        await this.processItem(entryPath, entryRelativePathParts, structure);
      }
    } else {
      await this.addFileToStructure(structure, filePath, pathParts);
    }
  }

  private async addFileToStructure(structure: any, filePath: string, pathParts: string[]) {
    const name = pathParts.shift()!;
    if (pathParts.length === 0) {
      let content;
      if (this.hideBinaryContent && await isBinaryFile(filePath)) {
        content = '(binary)';
      } else {
        content = fs.readFileSync(filePath, 'utf-8');
      }
      structure[name] = content;
    } else {
      if (!structure[name]) {
        structure[name] = {};
      }
      await this.addFileToStructure(structure[name], filePath, pathParts);
    }
  }
}
