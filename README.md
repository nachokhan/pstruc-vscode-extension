# Pstruc-Extension

Welcome to **pstruc-ext**, the ultimate tool for generating a structured JSON representation of your project's file and directory hierarchy in Visual Studio Code. This extension simplifies the management of complex project structures by creating an easily navigable JSON file.

![VPReview](./images/pstruc_example.gif)

## Features

- **Generate JSON Structure**: Quickly generate a JSON file (`structure.json`) that represents the file and directory hierarchy of your project.
- **Customizable Ignore Patterns**: Use your own ignore patterns to exclude specific files or directories from the JSON structure.
- **Efficient Processing**: Automatically replaces directories with their contained files and sorts items for optimal readability.
- **Easy Integration**: Seamlessly integrates with your existing workflow in Visual Studio Code.

## How to Use

1. **Open Your Project**: Open the project you want to generate a structure for in Visual Studio Code.
2. **Select Files/Folders**: Select the files and/or folders you want to include in the JSON structure.
3. **Run the Command**: Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and run `Generate Structure`.
4. **Copy the JSON File**: Copy the content of `structure.json` file (placed in the root of your workspace).
5. **Paste it in some LLM**: Paste the `strcutre.json` content together with the prompt indicated inthe next section.
6. **Ask the LLM any question**: ask for code reviews, new code, docummentation, explanations, etc.

## Suggested PROMPT

You might change it for your personal interest, but here is a commonly useful prompt:

Role: You are a coding assistant specializing in multiple programming languages. Your primary task is to help users with their coding projects based on a provided project structure in JSON format. This JSON structure will represent the project starting from the root directory, with each 'field' corresponding to a folder or file. Folders may contain subfolders or files, while files either display their content or indicate '(binary)' if they are binary files.

Instructions:

- Always begin by requesting the project structure in JSON format from the user.
- After receiving the JSON structure, ask the user what specific coding assistance they need.
- When suggesting code changes, if the modifications affect 15% or less of the original content, avoid returning the entire file. Instead, provide only the relevant changes.
- If more than 15% of the code is modified, you may return the entire file, function, or relevant section that was altered.
- Ensure all code names and comments you provide are in English.
- Maintain a casual and friendly tone to make the interaction easygoing and approachable.


## Requirements

- Visual Studio Code version 1.50.0 or higher.

## Extension Settings

This extension contributes the following settings:

- `pstruc_extension.ignorePatterns`: Array of glob patterns to ignore specific files or directories.
- `pstruc_extension.hideBinaryContent`: Boolean to hide binary file content by replacing it with "(binary)".

## Known Issues

- Currently, large projects with many nested directories might take longer to process.

## Release Notes

### 1.0.0

- Initial release of `pstruc-ext`.

### 1.0.1

- Fixed minor bugs.

### 1.0.2

- Added "Hide binary file's content" option to replace binary file content with "(binary)" in the generated JSON structure. The option is enabled by default.
- Fixed minor bugs.

## Enjoy!

We hope you find `pstruc-ext` useful for managing your project structures. If you have any feedback or suggestions, please open an issue on our [GitHub repository](https://github.com/nachokhan/pstruc-vscode-extension).
