## Development Setup

If you want to develop and contribute to this extension, follow these steps:

1. **Clone the repository:**
   Clone the GitHub repository to your local machine.

   ```bash
   git clone https://github.com/nachokhan/pstruc-vscode-extension.git
   ```

2. **Install dependencies:**
   Navigate to the cloned project directory and run the following command to install the necessary dependencies:

   ```bash
   cd pstruc-vscode-extension
   yarn install
   ```

3. **Compile the project:**
   Run the following command to compile the TypeScript project:

   ```bash
   yarn run compile
   ```

4. **Open in Visual Studio Code:**
   Open Visual Studio Code in the project directory:

   ```bash
   code .
   ```

5. **Run and test the extension:**
   - Press `F5` to open a new VS Code window with your extension loaded.
   - You can make changes to the code and press `F5` again to see the results.
   - Use the "Output" panel to view logs generated by the extension during execution.

6. **Run the tests:**
   If you want to run the tests to ensure everything works correctly, you can use:

   ```bash
   yarn run test
   ```

7. **Publish the changes (optional):**
   If you have permissions to publish the extension, you can update the version and publish the changes with:

   ```bash
   yarn run vscode:prepublish
   ```

   Then follow the [VS Code extension publishing instructions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension).
