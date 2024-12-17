import * as assert from 'assert';
import * as vscode from 'vscode';
//TODO: i don't know why this is not working
suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Hover provider test for keyword "visitors"', async () => {
		const document = await vscode.workspace.openTextDocument({
			content: 'visitors',
			language: 'plaintext'
		});
		const position = new vscode.Position(0, 0);
		const hover = await vscode.commands.executeCommand<vscode.Hover[]>(
			'vscode.executeHoverProvider',
			document.uri,
			position
		);
		assert.ok(hover);
		assert.strictEqual(hover.length > 0, true);
		assert.strictEqual((hover[0].contents[0] as vscode.MarkdownString).value.includes('**visitors**'), true);
	});
});
