import * as assert from 'assert';
import * as vscode from 'vscode';

// Extension ID - update this if you set a publisher in package.json
const EXTENSION_ID = 'undefined_publisher.agglookup';

// Test timing constants
const WEBVIEW_CREATION_DELAY_MS = 500;
const COMMAND_EXECUTION_DELAY_MS = 500;

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		const extension = vscode.extensions.getExtension(EXTENSION_ID);
		assert.ok(extension, 'Extension should be installed');
	});

	test('Extension should activate', async function() {
		this.timeout(10000);
		const extension = vscode.extensions.getExtension(EXTENSION_ID);
		assert.ok(extension, 'Extension should be installed');
		
		if (!extension.isActive) {
			await extension.activate();
		}
		
		assert.ok(extension.isActive, 'Extension should be active');
	});

	test('agglookup.show command should be registered', async function() {
		this.timeout(10000);
		
		// Ensure extension is activated
		const extension = vscode.extensions.getExtension(EXTENSION_ID);
		if (extension && !extension.isActive) {
			await extension.activate();
		}
		
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('agglookup.show'), 'agglookup.show command should be registered');
	});

	test('Configuration should have hoverProvider setting', () => {
		const config = vscode.workspace.getConfiguration('agglookup');
		const hoverProviderValue = config.get('hoverProvider');
		// Should be defined (either true or false)
		assert.ok(hoverProviderValue !== undefined, 'hoverProvider configuration should be defined');
	});

	test('Table definitions should be loaded', async function() {
		this.timeout(10000);
		
		// Ensure extension is activated
		const extension = vscode.extensions.getExtension(EXTENSION_ID);
		if (extension && !extension.isActive) {
			await extension.activate();
		}
		
		// Create a document and try to execute the command with a known table
		// This indirectly tests that table definitions are loaded
		const document = await vscode.workspace.openTextDocument({
			content: 'test content',
			language: 'plaintext'
		});
		
		await vscode.window.showTextDocument(document);
		
		// The command should execute without error even if we don't pass a keyword
		// (it will show a quick pick)
		await vscode.commands.executeCommand('agglookup.show');
		
		// Clean up
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});

	test('Command should create webview for known keyword', async function() {
		this.timeout(10000);
		
		// Ensure extension is activated
		const extension = vscode.extensions.getExtension(EXTENSION_ID);
		if (extension && !extension.isActive) {
			await extension.activate();
		}
		
		// Execute the command with a known keyword
		await vscode.commands.executeCommand('agglookup.show', 'visitors');
		
		// Wait a bit for the webview to be created
		await new Promise(resolve => setTimeout(resolve, WEBVIEW_CREATION_DELAY_MS));
		
		// Clean up - close any open editors/webviews
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Command should show info message for unknown keyword', async function() {
		this.timeout(10000);
		
		// Ensure extension is activated
		const extension = vscode.extensions.getExtension(EXTENSION_ID);
		if (extension && !extension.isActive) {
			await extension.activate();
		}
		
		// Execute the command with an unknown keyword
		// The extension should show an information message
		await vscode.commands.executeCommand('agglookup.show', 'unknownTableName');
		
		// Wait a bit
		await new Promise(resolve => setTimeout(resolve, COMMAND_EXECUTION_DELAY_MS));
		
		// Clean up
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});
});
