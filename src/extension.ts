import * as vscode from 'vscode';
import marked from 'marked';
import { loadTableDefinitions } from './tableLoader';

// Load table definitions from external JSON file
let keywordTableMap: { [key: string]: vscode.MarkdownString } = {};

export function activate(context: vscode.ExtensionContext) {
	// Load table definitions from JSON file
	keywordTableMap = loadTableDefinitions(context.extensionPath);

	const disposable = vscode.commands.registerCommand('agglookup.show', async (keyword: string) => {
		if (!keyword) {
			const suggestions: vscode.QuickPickItem[] = Object.keys(keywordTableMap).map(key => ({ label: key }));
			const selected = await vscode.window.showQuickPick(suggestions, {
				placeHolder: 'Select a keyword to look up',
			});
			keyword = selected ? selected.label : '';
		}

		if (keyword && keywordTableMap[keyword]) {
			const panel = vscode.window.createWebviewPanel(
				'agglookup',
				`Lookup: ${keyword}`,
				vscode.ViewColumn.One,
				{
					enableScripts: true // Enable scripts in the webview
				}
			);
			panel.webview.html = getWebviewContent(keywordTableMap[keyword].value);
		} else {
			vscode.window.showInformationMessage(`Keyword "${keyword}" not found.`);
		}
	});

	context.subscriptions.push(disposable);

	const config = vscode.workspace.getConfiguration('agglookup');
	const enableHoverProvider = config.get<boolean>('hoverProvider', false);
	if (enableHoverProvider) {
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
}

function getWebviewContent(markdown: string): string {
	const md = marked.parse(markdown.replace(/\n/g, '  \n'));
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Lookup Table</title>
		</head>
		<body>
			<div id="content"></div>
			<script>
				document.getElementById('content').innerHTML = \`${md}\`;
			</script>
		</body>
		</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
