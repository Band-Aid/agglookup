import * as assert from 'assert';
import * as path from 'path';
import { loadTableDefinitions } from '../tableLoader';

suite('Table Loader Test Suite', () => {
	test('Should load table definitions from JSON file', () => {
		// Get the extension path (go up from test directory)
		const extensionPath = path.join(__dirname, '../../');
		
		const tables = loadTableDefinitions(extensionPath);
		
		// Verify that tables are loaded
		assert.ok(tables, 'Tables should be loaded');
		assert.ok(Object.keys(tables).length > 0, 'Tables should not be empty');
	});

	test('Should contain expected table names', () => {
		const extensionPath = path.join(__dirname, '../../');
		const tables = loadTableDefinitions(extensionPath);
		
		// Check for some known table names
		assert.ok(tables['visitors'], 'Should have visitors table');
		assert.ok(tables['accounts'], 'Should have accounts table');
		assert.ok(tables['pages'], 'Should have pages table');
		assert.ok(tables['features'], 'Should have features table');
		assert.ok(tables['guides'], 'Should have guides table');
	});

	test('Should generate proper markdown format', () => {
		const extensionPath = path.join(__dirname, '../../');
		const tables = loadTableDefinitions(extensionPath);
		
		const visitorsTable = tables['visitors'];
		assert.ok(visitorsTable, 'Visitors table should exist');
		
		const markdownContent = visitorsTable.value;
		
		// Check that it contains table formatting
		assert.ok(markdownContent.includes('| **visitors** |'), 'Should have table name header');
		assert.ok(markdownContent.includes('|---------|\n'), 'Should have separator line');
		assert.ok(markdownContent.includes('| visitorld |'), 'Should have field names');
	});

	test('Should handle all table definitions', () => {
		const extensionPath = path.join(__dirname, '../../');
		const tables = loadTableDefinitions(extensionPath);
		
		const expectedTables = [
			'visitors', 'accounts', 'pages', 'features', 'trackTypes',
			'guides', 'groups', 'events', 'pageEvents', 'featureEvents',
			'trackEvents', 'guideEvents', 'pollEvents', 'guidesSeen',
			'pollsSeen', 'singleEvents', 'emailEvents'
		];
		
		for (const tableName of expectedTables) {
			assert.ok(tables[tableName], `Should have ${tableName} table`);
		}
	});
});
