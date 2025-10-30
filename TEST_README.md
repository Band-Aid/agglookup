# Testing Guide for agglookup Extension

This document explains how to test the agglookup VSCode extension.

## Test Structure

The extension has three test suites:

1. **Table Loader Tests** (`tableLoader.test.ts`)
   - Tests the loading and parsing of table definitions from `tables.json`
   - Validates markdown table generation
   - Can run without the extension being fully activated

2. **Extension Tests** (`extension.test.ts`)
   - Tests basic extension functionality
   - Tests extension activation
   - Tests command registration
   - Tests webview creation for known/unknown keywords
   - Can run with default configuration

3. **Hover Provider Tests** (`hoverProvider.test.ts`)
   - Tests the hover provider feature
   - **Requires `agglookup.hoverProvider` to be enabled before running**
   - Tests hover functionality for various table names
   - Tests hover with keywords in different contexts

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile the extension:
   ```bash
   npm run compile
   ```

### Running All Tests

To run all tests:
```bash
npm test
```

**Note:** This requires VSCode to be downloadable by the test runner. In restricted environments where VSCode cannot be downloaded, tests will fail with a network error.

### Running Tests in VSCode

1. Open the project in VSCode
2. Press `F5` or use the "Run Extension" debug configuration
3. In the Extension Development Host window, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
4. Type "Developer: Show Running Extensions" to verify the extension is active
5. Use the Test Explorer view or Command Palette to run tests

### Running Hover Provider Tests

The hover provider tests require the `agglookup.hoverProvider` setting to be enabled **before** the extension activates. There are two ways to do this:

#### Option 1: Manual Configuration (Recommended for Development)

1. Open VSCode settings (File > Preferences > Settings or `Ctrl+,`)
2. Search for "agglookup hover"
3. Enable the "Agglookup: Hover Provider" setting
4. Restart VSCode or reload the window
5. Run the tests

#### Option 2: Settings File

Add to your `.vscode/settings.json` in your test workspace:
```json
{
  "agglookup.hoverProvider": true
}
```

## Test Coverage

### Table Loader Tests
- ✅ Loads table definitions from JSON
- ✅ Contains expected table names
- ✅ Generates proper markdown format
- ✅ Handles all table definitions

### Extension Tests
- ✅ Extension is present and can be found
- ✅ Extension activates successfully
- ✅ Commands are registered
- ✅ Configuration settings exist
- ✅ Table definitions are loaded
- ✅ Webview created for known keywords
- ✅ Info message shown for unknown keywords

### Hover Provider Tests
- ✅ Hover works for "visitors" table
- ✅ Hover works for "accounts" table
- ✅ Hover works for "pages" table
- ✅ Hover works for "features" table
- ✅ Hover works for "guides" table
- ✅ No hover for unknown keywords
- ✅ Hover works with keyword in middle of text
- ✅ Hover works with keyword on different lines

## Troubleshooting

### "Extension not installed" error

This error occurs when:
1. The extension ID in tests doesn't match the actual extension ID
2. The extension hasn't been installed in the test environment

**Solution:** The tests use `'undefined_publisher.agglookup'` as the extension ID. This is the default ID when no publisher is specified in `package.json`. If you've set a publisher, update the extension ID in the tests.

### Hover provider tests fail

If hover provider tests fail, check:
1. Is `agglookup.hoverProvider` enabled in settings?
2. Was the setting enabled **before** the extension activated?
3. Try reloading the window after enabling the setting

### Tests timeout

If tests timeout:
1. Increase timeout values in test functions
2. Check if VSCode test instance is responding
3. Try running tests individually instead of all at once

### Network errors during test

If you see "getaddrinfo ENOTFOUND update.code.visualstudio.com":
- This means the test environment cannot download VSCode
- Tests need to be run in an environment with internet access
- Or run tests from within VSCode's Extension Development Host

## Manual Testing

While automated tests cover most functionality, you should also manually test:

1. **Hover Provider:**
   - Open any file in VSCode
   - Type a table name (e.g., "visitors", "accounts")
   - Hover over the keyword
   - Verify the hover shows table fields in a markdown table format

2. **Command Execution:**
   - Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Type "agglookup: show"
   - Select a table from the quick pick
   - Verify webview opens with table information

3. **Configuration:**
   - Toggle the `agglookup.hoverProvider` setting
   - Reload the window
   - Verify hover provider is enabled/disabled accordingly

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Use descriptive test names
3. Add appropriate timeouts for async operations
4. Clean up resources (close editors) after tests
5. Update this README with new test coverage
