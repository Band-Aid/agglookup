import * as assert from 'assert';
import * as vscode from 'vscode';

// Extension ID - update this if you set a publisher in package.json
const EXTENSION_ID = 'undefined_publisher.agglookup';

/**
 * Hover Provider Test Suite
 * 
 * Note: These tests require the hover provider to be enabled.
 * To run these tests successfully:
 * 1. Set "agglookup.hoverProvider": true in your VSCode settings before running tests
 * 2. Or set it programmatically in the test environment
 * 
 * The hover provider is only registered during extension activation if the 
 * configuration is already enabled, so tests must ensure this configuration is
 * set before the extension activates.
 */
suite('Hover Provider Test Suite', () => {
	
	suiteSetup(async function() {
		this.timeout(30000);
		
		// Enable hover provider configuration before extension activates
		// Note: Using Global scope because Workspace scope may not be available in test environment
		const config = vscode.workspace.getConfiguration('agglookup');
		await config.update('hoverProvider', true, vscode.ConfigurationTarget.Global);
		
		// Wait for configuration to propagate
		// Note: Fixed delay is used here as configuration changes are async
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// Now activate the extension
		const extension = vscode.extensions.getExtension(EXTENSION_ID);
		if (extension && !extension.isActive) {
			await extension.activate();
		}
		
		// Wait for extension to fully initialize
		// Note: This delay ensures all providers are registered
		await new Promise(resolve => setTimeout(resolve, 1000));
	});

	suiteTeardown(async function() {
		this.timeout(10000);
		
		// Disable hover provider after tests
		const config = vscode.workspace.getConfiguration('agglookup');
		await config.update('hoverProvider', false, vscode.ConfigurationTarget.Global);
		
		// Close all editors
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Hover provider should be active for keyword "visitors"', async function() {
		this.timeout(15000);
		
		// Create a document with the keyword "visitors"
		const document = await vscode.workspace.openTextDocument({
			content: 'visitors',
			language: 'plaintext'
		});
		
		// Show the document in an editor
		await vscode.window.showTextDocument(document);
		
		// Position cursor in the middle of the word "visitors"
		// This ensures we're hovering over the keyword
		const position = new vscode.Position(0, 4);
		
		// Execute hover provider command
		const hover = await vscode.commands.executeCommand<vscode.Hover[]>(
			'vscode.executeHoverProvider',
			document.uri,
			position
		);
		
		// Verify hover result
		assert.ok(hover, 'Hover should return a result');
		assert.ok(hover.length > 0, 'Hover should have at least one item');
		
		// Check the hover content
		const hoverContent = hover[0].contents[0] as vscode.MarkdownString;
		assert.ok(hoverContent, 'Hover should have content');
		assert.ok(hoverContent.value.includes('**visitors**'), 
			'Hover should contain the table name "visitors"');
		assert.ok(hoverContent.value.includes('visitorld'), 
			'Hover should contain field "visitorld" from the visitors table');
		
		// Close the editor
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});

	test('Hover provider should work for keyword "accounts"', async function() {
		this.timeout(15000);
		
		const document = await vscode.workspace.openTextDocument({
			content: 'accounts',
			language: 'plaintext'
		});
		
		await vscode.window.showTextDocument(document);
		
		// Position in the middle of "accounts"
		const position = new vscode.Position(0, 4);
		
		const hover = await vscode.commands.executeCommand<vscode.Hover[]>(
			'vscode.executeHoverProvider',
			document.uri,
			position
		);
		
		assert.ok(hover);
		assert.ok(hover.length > 0);
		
		const hoverContent = hover[0].contents[0] as vscode.MarkdownString;
		assert.ok(hoverContent.value.includes('**accounts**'));
		assert.ok(hoverContent.value.includes('accountId'));
		
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});

	test('Hover provider should work for keyword "pages"', async function() {
		this.timeout(15000);
		
		const document = await vscode.workspace.openTextDocument({
			content: 'pages',
			language: 'plaintext'
		});
		
		await vscode.window.showTextDocument(document);
		
		const position = new vscode.Position(0, 2);
		
		const hover = await vscode.commands.executeCommand<vscode.Hover[]>(
			'vscode.executeHoverProvider',
			document.uri,
			position
		);
		
		assert.ok(hover);
		assert.ok(hover.length > 0);
		
		const hoverContent = hover[0].contents[0] as vscode.MarkdownString;
		assert.ok(hoverContent.value.includes('**pages**'));
		
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});

	test('Hover provider should work for keyword "features"', async function() {
		this.timeout(15000);
		
		const document = await vscode.workspace.openTextDocument({
			content: 'features',
			language: 'plaintext'
		});
		
		await vscode.window.showTextDocument(document);
		
		const position = new vscode.Position(0, 4);
		
		const hover = await vscode.commands.executeCommand<vscode.Hover[]>(
			'vscode.executeHoverProvider',
			document.uri,
			position
		);
		
		assert.ok(hover);
		assert.ok(hover.length > 0);
		
		const hoverContent = hover[0].contents[0] as vscode.MarkdownString;
		assert.ok(hoverContent.value.includes('**features**'));
		
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});

	test('Hover provider should work for keyword "guides"', async function() {
		this.timeout(15000);
		
		const document = await vscode.workspace.openTextDocument({
			content: 'guides',
			language: 'plaintext'
		});
		
		await vscode.window.showTextDocument(document);
		
		const position = new vscode.Position(0, 3);
		
		const hover = await vscode.commands.executeCommand<vscode.Hover[]>(
			'vscode.executeHoverProvider',
			document.uri,
			position
		);
		
		assert.ok(hover);
		assert.ok(hover.length > 0);
		
		const hoverContent = hover[0].contents[0] as vscode.MarkdownString;
		assert.ok(hoverContent.value.includes('**guides**'));
		
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});

	test('Hover provider should not activate for unknown keyword', async function() {
		this.timeout(15000);
		
		const document = await vscode.workspace.openTextDocument({
			content: 'unknownKeyword',
			language: 'plaintext'
		});
		
		await vscode.window.showTextDocument(document);
		
		const position = new vscode.Position(0, 7);
		
		const hover = await vscode.commands.executeCommand<vscode.Hover[]>(
			'vscode.executeHoverProvider',
			document.uri,
			position
		);
		
		// For unknown keywords, our extension should not provide hover information
		// Other extensions might still provide hover, so we check that our specific
		// table format is not present
		if (hover && hover.length > 0) {
			const hoverContent = hover[0].contents[0] as vscode.MarkdownString;
			// Our extension uses a specific markdown table format with |---------|\n
			// and bold table names. Check both patterns to be more robust.
			const hasTableSeparator = hoverContent.value.includes('|---------|\n');
			const hasBoldTableName = hoverContent.value.match(/\*\*[a-zA-Z]+\*\*/);
			const isOurHover = hasTableSeparator && hasBoldTableName;
			assert.ok(!isOurHover, 'Our extension should not provide hover for unknown keywords');
		}
		
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});

	test('Hover provider should work with keyword in middle of text', async function() {
		this.timeout(15000);
		
		// Create document with keyword surrounded by other text
		const document = await vscode.workspace.openTextDocument({
			content: 'The visitors table contains data',
			language: 'plaintext'
		});
		
		await vscode.window.showTextDocument(document);
		
		// Position on the word "visitors" (starts at position 4)
		const position = new vscode.Position(0, 8);
		
		const hover = await vscode.commands.executeCommand<vscode.Hover[]>(
			'vscode.executeHoverProvider',
			document.uri,
			position
		);
		
		assert.ok(hover);
		assert.ok(hover.length > 0);
		
		const hoverContent = hover[0].contents[0] as vscode.MarkdownString;
		assert.ok(hoverContent.value.includes('**visitors**'));
		
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});

	test('Hover provider should work with keyword on different line', async function() {
		this.timeout(15000);
		
		const document = await vscode.workspace.openTextDocument({
			content: 'Some text\naccounts\nMore text',
			language: 'plaintext'
		});
		
		await vscode.window.showTextDocument(document);
		
		// Position on "accounts" on line 1 (second line)
		const position = new vscode.Position(1, 4);
		
		const hover = await vscode.commands.executeCommand<vscode.Hover[]>(
			'vscode.executeHoverProvider',
			document.uri,
			position
		);
		
		assert.ok(hover);
		assert.ok(hover.length > 0);
		
		const hoverContent = hover[0].contents[0] as vscode.MarkdownString;
		assert.ok(hoverContent.value.includes('**accounts**'));
		
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});
});
