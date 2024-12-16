// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Define keywords and their table content
const keywordTableMap: { [key: string]: vscode.MarkdownString } = {
    'keyword1': new vscode.MarkdownString(`| Column1 | Column2 |\n|---------|---------|\n| Data1   | Data2   |`),
    'keyword2': new vscode.MarkdownString(`| ColumnA | ColumnB |\n|---------|---------|\n| ValueA  | ValueB  |`)
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "agglookup" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('agglookup.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from aggtablelookup!');
	});

	context.subscriptions.push(disposable);

    // Register the HoverProvider
    const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: '*', language: '*' },
        {
            provideHover(document, position, token) {
                const range = document.getWordRangeAtPosition(position);
                const word = document.getText(range);
				console.log('word:', word);
                if (keywordTableMap[word]) {
                    return new vscode.Hover(keywordTableMap[word]);
                }
            }
        }
    );

    context.subscriptions.push(hoverProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
