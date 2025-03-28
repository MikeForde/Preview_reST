# Preview reST

Preview reST is a Visual Studio Code extension that allows you to preview your reStructuredText (`.rst`) files as HTML. This extension converts your reST content into HTML using Docutils and displays it in a live, side-by-side webview that updates as you edit the file.

## Features

- **Live Preview:** Automatically updates the HTML preview as you modify your `.rst` file.
- **Side-by-Side View:** Opens the preview in a webview next to your editor.
- **Command Palette & Editor Title:** Launch the preview via the Command Palette or by clicking the preview icon in the editor title bar.
- **Custom Conversion:** Utilizes a custom Python script (`rst2html_converter.py`) included in the extension directory for converting reST files to HTML.

*Include screenshots or animated GIFs here to show your extension in action, for example:*

![Preview reST in action](images/preview-restructuredtext.gif)

## Requirements

- **Python 3:** Ensure Python 3 is installed.
- **Docutils:** Install Docutils by running:
  ```bash
  pip install docutils
  ```
- **Python Script:** The extension uses a custom Python script (`rst2html_converter.py`) included in the extension directory for converting reST files to HTML.

## Extension Settings

At this time, Preview reST does not contribute any additional settings. Future updates may include configuration options for the conversion process or preview behavior.

## Known Issues

- The extension depends on Python and Docutils being correctly installed and accessible via your system's PATH.
- Some complex or malformed reST files might not render as expected. Please report any issues on the extension's repository.

## Release Notes

### 1.0.0
- Initial release of Preview reST.
- Added live HTML preview functionality for reStructuredText files.

### 1.1.0
- Improved auto-update on file changes.
- Minor bug fixes and performance improvements.

## Following Extension Guidelines

Please review the [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines) to ensure your extension meets best practices.

## Working with Markdown

You can use Visual Studio Code to edit this README. Useful shortcuts include:

- **Split Editor:** `Cmd+\` on macOS or `Ctrl+\` on Windows/Linux.
- **Toggle Preview:** `Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows/Linux.
- **Markdown Autocomplete:** Press `Ctrl+Space` (all platforms) to view Markdown snippet suggestions.

## For More Information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy Preview reST!**
