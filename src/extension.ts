import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('rstPreview.showPreview', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage("No active editor found.");
            return;
        }
        
        const document = editor.document;
        if (!document.fileName.endsWith('.rst')) {
            vscode.window.showInformationMessage("The active file is not a .rst file.");
            return;
        }

        // Create and show a new webview panel
        const panel = vscode.window.createWebviewPanel(
            'rstPreview',           // Identifies the type of the webview
            'reST Preview',         // Title of the panel
            vscode.ViewColumn.Beside,// Show beside the current editor
            { enableScripts: true } // Enable scripts in the webview if needed
        );

        // Build the command that calls the Python script
        // Assume the script is in the extension folder (adjust the path if needed)
        const extensionPath = context.extensionPath;
        const scriptPath = path.join(extensionPath, 'rst2html_converter.py');
        const filePath = document.uri.fsPath;
        const command = `python3 "${scriptPath}" "${filePath}"`;

        // Function to update the preview
        function updatePreview() {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    panel.webview.html = `<html><body>
                        <h2>Error generating preview</h2>
                        <pre>${stderr}</pre>
                        </body></html>`;
                } else if (stdout.trim() === "") {
                    panel.webview.html = `<html><body>
                        <h2>No output generated. Check your .rst file for content.</h2>
                        </body></html>`;
                } else {
                    panel.webview.html = stdout;
                }
            });
        }

        // Update the preview initially
        updatePreview();

        // Listen for changes in the document and update the preview.
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updatePreview();
            }
        });
        context.subscriptions.push(changeDocumentSubscription);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
