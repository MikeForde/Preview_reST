// Assuming this is part of your extension's activate function or updatePreview logic
import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let isEditorScrolling = false;
    let isPreviewScrolling = false;


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

        const panel = vscode.window.createWebviewPanel(
            'rstPreview',
            'reST Preview',
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );

        const extensionPath = context.extensionPath;
        const scriptPath = path.join(extensionPath, 'rst2html_converter.py');
        const filePath = document.uri.fsPath;
        const command = `python3 "${scriptPath}" "${filePath}"`;

        function wrapHtml(body: string): string {
            return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { padding: 2em; font-family: sans-serif; }
  </style>
</head>
<body>
${body}
<script>
(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener('message', event => {
        const message = event.data;
        if (message.type === 'scrollToPercent') {
            window.scrollTo(0, document.body.scrollHeight * message.percent);
        }
    });

    window.addEventListener('scroll', () => {
        const percent = window.scrollY / document.body.scrollHeight;
        vscode.postMessage({ type: 'scrollPercent', percent });
    });
})();
</script>
</body>
</html>`;
        }

        function updatePreview() {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    panel.webview.html = `<html><body><h2>Error generating preview</h2><pre>${stderr}</pre></body></html>`;
                } else if (stdout.trim() === "") {
                    panel.webview.html = `<html><body><h2>No output generated. Check your .rst file for content.</h2></body></html>`;
                } else {
                    panel.webview.html = wrapHtml(stdout);
                }
            });
        }

        updatePreview();

        const changeDocSub = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updatePreview();
            }
        });
        context.subscriptions.push(changeDocSub);

        const scrollEditorSub = vscode.window.onDidChangeTextEditorVisibleRanges(e => {
            if (e.textEditor.document.uri.toString() === document.uri.toString()) {
                if (isPreviewScrolling) return; // skip if preview initiated this
                isEditorScrolling = true;
        
                const visibleLine = e.visibleRanges[0]?.start.line || 0;
                const totalLines = e.textEditor.document.lineCount;
                const percent = visibleLine / totalLines;
                panel.webview.postMessage({ type: 'scrollToPercent', percent });
        
                setTimeout(() => { isEditorScrolling = false; }, 100); // reset
            }
        });
        
        context.subscriptions.push(scrollEditorSub);

        // Scroll preview -> editor
        panel.webview.onDidReceiveMessage(message => {
            if (message.type === 'scrollPercent') {
                if (isEditorScrolling) return; // skip if editor initiated this
                isPreviewScrolling = true;
        
                const activeEditor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === document.uri.toString());
                if (activeEditor) {
                    const totalLines = activeEditor.document.lineCount;
                    const targetLine = Math.floor(message.percent * totalLines);
                    const range = new vscode.Range(targetLine, 0, targetLine, 0);
                    activeEditor.revealRange(range, vscode.TextEditorRevealType.AtTop);
                }
        
                setTimeout(() => { isPreviewScrolling = false; }, 100); // reset
            }
        });
        
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
