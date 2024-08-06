import * as vscode from 'vscode';

export class FileStructureProvider implements vscode.TreeDataProvider<FileItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<FileItem | undefined> = new vscode.EventEmitter<FileItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<FileItem | undefined> = this._onDidChangeTreeData.event;
  private fileName: string = "default.json";
  private hideBinaryContent: boolean = true;

  getTreeItem(element: FileItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FileItem): Thenable<FileItem[]> {
    if (!element) {
      const items: FileItem[] = [];
      const fileNameItem = new FileItem(`Output File: ${this.fileName}`, vscode.TreeItemCollapsibleState.None);
      fileNameItem.command = {
        command: 'fileStructure.renameFile',
        title: 'Rename Output File',
        arguments: [fileNameItem]
      };
      items.push(fileNameItem);

      const hideBinaryContentItem = new FileItem(`Hide binary content: ${this.hideBinaryContent ? "Yes" : "No"}`, vscode.TreeItemCollapsibleState.None);
      hideBinaryContentItem.command = {
        command: 'fileStructure.toggleHideBinaryContent',
        title: 'Toggle Hide Binary Content',
        arguments: [hideBinaryContentItem]
      };
      items.push(hideBinaryContentItem);

      return Promise.resolve(items);
    }
    return Promise.resolve([]);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  async renameFile() {
    const inputBoxOptions: vscode.InputBoxOptions = {
      prompt: "Output file name",
      placeHolder: "Enter the output file name",
      value: this.fileName
    };
    const value = await vscode.window.showInputBox(inputBoxOptions);
    if (value) {
      this.fileName = value;
      this.refresh();
    }
  }

  toggleHideBinaryContent() {
    this.hideBinaryContent = !this.hideBinaryContent;
    this.refresh();
  }
}

class FileItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.contextValue = 'fileItem';
  }
}
