import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface TableDefinitions {
    [key: string]: string[];
}

/**
 * Convert an array of field names to a markdown table
 * @param tableName The name of the table
 * @param fields Array of field names
 * @returns Markdown string representing the table
 */
function convertToMarkdownTable(tableName: string, fields: string[]): string {
    const header = `| **${tableName}** |\n|---------|\n`;
    const rows = fields.map(field => `| ${field} |`).join('\n');
    return header + rows;
}

/**
 * Load table definitions from JSON file and convert to MarkdownString map
 * @param extensionPath The path to the extension directory
 * @returns Map of table names to MarkdownString objects
 */
export function loadTableDefinitions(extensionPath: string): { [key: string]: vscode.MarkdownString } {
    try {
        const tablesFilePath = path.join(extensionPath, 'tables.json');
        const fileContent = fs.readFileSync(tablesFilePath, 'utf8');
        const tableDefinitions: TableDefinitions = JSON.parse(fileContent);
        
        const keywordTableMap: { [key: string]: vscode.MarkdownString } = {};
        
        for (const [tableName, fields] of Object.entries(tableDefinitions)) {
            const markdownContent = convertToMarkdownTable(tableName, fields);
            keywordTableMap[tableName] = new vscode.MarkdownString(markdownContent);
        }
        
        return keywordTableMap;
    } catch (error) {
        console.error('Error loading table definitions:', error);
        throw error;
    }
}
