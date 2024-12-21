# agglookup README

This extension allows you to look up Pendo aggregation tables by providing keywords.

Build extension using vsce package and install vsix

## Features

- Look up Pendo aggregation tables by entering keywords such as `visitors`, `accounts`, `pages`, etc.
- Displays the table content in a webview panel.
- Provides hover information for keywords in any text document.

Only highlights most common fields.

## Available sources
'visitors'
'accounts'
'pages'
'features'
'trackTypes' 
'guides'
'groups'
'events'
'pageEvents' 
'featureEvents'
'trackEvents'
'guideEvents'
'pollEvents' 
'guidesSeen' 
'pollsSeen'
'singleEvents'

## Known Issues

Does not automatically activate. You need to use the command agglookup: show to activate.
Once activated it will stay activated on all files.
TODO: fix activation

## Release Notes

### 0.0.5

added fields to some sources

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

