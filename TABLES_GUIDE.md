# Table Definitions Guide

## Overview

Table definitions are now stored in a separate JSON file (`tables.json`) making them easy to update without modifying source code.

## File Structure

The `tables.json` file contains a simple object where:
- **Keys** are table names (e.g., "visitors", "accounts")
- **Values** are arrays of field names

### Example:

```json
{
  "visitors": [
    "visitorld",
    "metadata",
    "metadata.auto.accountid"
  ],
  "accounts": [
    "accountId",
    "metadata"
  ]
}
```

## How to Update Tables

### Adding a New Table

1. Open `tables.json`
2. Add a new entry with the table name and field list:

```json
{
  "existingTable": [...],
  "newTable": [
    "field1",
    "field2",
    "field3"
  ]
}
```

3. Save the file
4. Rebuild the extension: `npm run compile`

### Updating an Existing Table

1. Open `tables.json`
2. Find the table you want to update
3. Add, remove, or modify field names in the array
4. Save the file
5. Rebuild the extension: `npm run compile`

### Removing a Table

1. Open `tables.json`
2. Delete the entire entry for the table
3. Save the file
4. Rebuild the extension: `npm run compile`

## Benefits of This Approach

- **Easy to Edit**: Simple JSON format that anyone can understand
- **No Code Changes**: Update tables without touching TypeScript code
- **Version Control Friendly**: Easier to review changes in diffs
- **Scalable**: Add hundreds of tables without bloating the code
- **Maintainable**: Clear separation between data and logic

## Building the Extension

After making changes to `tables.json`, rebuild the extension:

```bash
npm run compile
```

This will:
1. Compile TypeScript files
2. Copy `tables.json` to the `out/` directory

## Testing Your Changes

After rebuilding:
1. Press F5 in VS Code to launch the extension development host
2. Use the command palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Run "agglookup: show"
4. Verify your changes appear in the table list

## File Format Requirements

- Must be valid JSON
- Keys should be unique table names (lowercase recommended)
- Values must be arrays of strings (field names)
- Field names can include special characters like `.`, `*`, `_`
