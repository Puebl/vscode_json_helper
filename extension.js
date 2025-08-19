const vscode = require('vscode');

function activate(context) {
  const prettify = vscode.commands.registerCommand('jsonHelper.prettify', function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const sel = editor.selection;
    const text = editor.document.getText(sel.isEmpty ? undefined : sel);
    try {
      const obj = JSON.parse(text);
      const pretty = JSON.stringify(obj, null, 2);
      editor.edit(edit => {
        if (sel.isEmpty) {
          const full = new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(editor.document.lineCount, 0)
          );
          edit.replace(full, pretty);
        } else {
          edit.replace(sel, pretty);
        }
      });
    } catch (e) {
      vscode.window.showErrorMessage('Invalid JSON: ' + e.message);
    }
  });

  const validate = vscode.commands.registerCommand('jsonHelper.validate', function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const sel = editor.selection;
    const text = editor.document.getText(sel.isEmpty ? undefined : sel);
    try {
      JSON.parse(text);
      vscode.window.showInformationMessage('JSON is valid');
    } catch (e) {
      vscode.window.showErrorMessage('Invalid JSON: ' + e.message);
    }
  });

  context.subscriptions.push(prettify, validate);
}

function deactivate() {}

module.exports = { activate, deactivate };
