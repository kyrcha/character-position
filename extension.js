// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let myStatusBarItem = vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "character-position" is now active!');
	// register a command that is invoked when the status bar
	// item is selected
	const myCommandId = 'extension.characterPosition';
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(myCommandId, function () {
		// The code you place here will be executed every time your command is executed
		let n = getCharacterPosition(vscode.window.activeTextEditor);
		// Display a message box to the user
		vscode.window.showInformationMessage(n);
		vscode.window.showInformationMessage(`The cursor is before chatecter ${n}... Keep going!`);
	});

	context.subscriptions.push(disposable);

	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	context.subscriptions.push(myStatusBarItem);

	// register some listener that make sure the status bar 
	// item always up-to-date
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

	// update status bar item once at start
	updateStatusBarItem();
}

function updateStatusBarItem() {
	let n = getCharacterPosition(vscode.window.activeTextEditor);
	if (n > 0) {
		myStatusBarItem.text = `$(megaphone) cursor at char ${n}`;
		myStatusBarItem.show();
	} else {
		myStatusBarItem.hide();
	}
}

function getCharacterPosition(editor) {
	let line = editor.selections[0].active.line
	let character = editor.selections[0].active.character
	// Get the contents from the start of the file till the cursor position
	let contents = editor.document.getText(new vscode.Range(new vscode.Position(0,0), new vscode.Position(line, character)))
	// Start at 1
	let position = 1
	let lines = contents.split('\n')
	for(const line of lines) {
		let newline = line.replace("\r", "")
		position += newline.length + 1 // add one character for each line 
	}
	return position - 1 // remove the + 1 that was added from the last line
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
