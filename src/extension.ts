import * as vscode from 'vscode';
import marked from 'marked';
// Define keywords and their table content
const keywordTableMap: { [key: string]: vscode.MarkdownString } = {
'visitors': new vscode.MarkdownString(`| **visitors** |\n|---------|\n| visitorld |\n| metadata |\n| metadata.auto.accountid |\n| metadata.auto.accountids |\n| metadata.auto.firstvisit |\n| metadata.auto.lastvisit |\n| metadata.auto.lastbrowsername |\n| metadata.auto.lastbrowserversion |\n| metadata.auto.lastoperatingsystem |\n| metadata.auto.lastservername |\n| metadata.auto.lastupdated |\n| metadata.auto.lastuseragent |\n| metadata.auto_*.* |\n| metadata.agent.* |\n| metadata.custom.* |\n| metadata.salesforce.* |\n| metadata.hubspot.* |\n| metadata.segmentio.* |`),
'accounts': new vscode.MarkdownString(`| **accounts** |\n|---------|\n| accountId |\n| metadata |\n| metadata.auto.firstvisit |\n| metadata.auto.lastvisit |\n| metadata.auto.lastupdated |\n| metadata.auto_*.* |\n| metadata.agent.* |\n| metadata.custom.* |\n| metadata.salesforce.* |\n| metadata.hubspot.* |\n| metadata.segmentio.* |`),
'pages': new vscode.MarkdownString(`| **pages** |\n|---------|\n| id |\n| appId |\n| name |\n| createdByUser |\n| createdAt |\n| lastUpdatedByUser |\n| lastUpdatedAt |\n| group |\n| isCoreEvent |\n| rules |\n| excludeRules |\n| isSuggested |\n| suggestedTagRules |`),
'features': new vscode.MarkdownString(`| **features** |\n|---------|\n| id |\n| appId |\n| name |\n| createdByUser |\n| createdAt |\n| lastUpdatedByUser |\n| lastUpdatedAt |\n| group |\n| isCoreEvent |\n| pageId |\n| appWide |\n| eventPropertyConfigurations |\n| elementPathRules |\n| isSuggested |\n| suggestedMatch |`),
'trackTypes': new vscode.MarkdownString(`| **trackTypes** |\n|---------|\n| id |\n| appId |\n| name |\n| createdByUser |\n| createdAt |\n| lastUpdatedByUser |\n| lastUpdatedAt |\n| group |\n| isCoreEvent |\n| rules |\n| eventPropertyNameList |`),
'guides': new vscode.MarkdownString(`| **guides** |\n|---------|\n| id |\n| appId |\n| name |\n| createdByUser |\n| createdAt |\n| lastUpdatedByUser |\n| lastUpdatedAt |\n| attributes.* |\n| audience |\n| conversion |\n| currentFirstEligibileToBeSeenAt |\n| dependentMetadata |\n| description |\n| emailState |\n| expiresAfter |\n| isModule |\n| isMultiStep |\n| isTopLevel |\n| launchMethod |\n| polls.* |\n| publishedAt |\n| publishedEver |\n| recurrence |\n| recurrenceEligibilityWindow |\n| redisplay |\n| resetAt |\n| showsAfter |\n| state |\n| steps.* |\n| translationStates |\n| validThrough |`),
'groups': new vscode.MarkdownString(`| **groups** |\n|---------|\n| id |\n| name |\n| createdByUser |\n| createdAt |\n| lastUpdatedByUser |\n| lastUpdatedAt |\n| color |\n| description |\n| length |\n| type |\n| feedbackProductId |\n| feedbackVisibility |`),
'events': new vscode.MarkdownString(`| **events** |\n|---------|\n| visitorld |\n| accountId |\n| appId |\n| hour |\n| day |\n| week |\n| month |\n| quarter |\n| firstTime |\n| lastTime |\n| pageId |\n| numEvents |\n| numMinutes |\n| remoteIp |\n| server |\n| userAgent |\n| tabId |\n| rageClickCount |\n| errorClickCount |\n| uTurnCount |\n| deadClickCount |\n| country |\n| region |\n| recordingId |\n| recordingSessionId |\n| tabId |\n| lastKeyFrameTimestamp |\n| properties |`),
'pageEvents': new vscode.MarkdownString(`| **pageEvents** |\n|---------|\n| visitorld |\n| accountId |\n| appId |\n| hour |\n| day |\n| week |\n| month |\n| quarter |\n| pageId |\n| numEvents |\n| numMinutes |\n| remoteIp |\n| server |\n| userAgent |\n| tabId |\n| rageClickCount |\n| errorClickCount |\n| uTurnCount |\n| deadClickCount  |\n| properties |`),
'featureEvents': new vscode.MarkdownString(`| **featureEvents** |\n|---------|\n| visitorld |\n| accountId |\n| appId |\n| hour |\n| day |\n| week |\n| month |\n| quarter |\n| featureId |\n| numEvents |\n| numMinutes |\n| remoteIp |\n| server |\n| userAgent |\n| tabId |\n| rageClickCount |\n| errorClickCount |\n| uTurnCount |\n| deadClickCount |\n| properties |`),
'trackEvents': new vscode.MarkdownString(`| **trackEvents** |\n|---------|\n| visitorld |\n| accountId |\n| appId |\n| hour |\n| day |\n| week |\n| month |\n| quarter |\n| trackTypeId |\n| numEvents |\n| numMinutes |\n| remoteIp |\n| server |\n| userAgent |\n| tabId |\n| properties |`),
'guideEvents': new vscode.MarkdownString(`| **guideEvents** |\n|---------|\n| visitorld |\n| accountId |\n| appId |\n| browserTime |\n| type |\n| guideId |\n| guideSeenReason |\n| guideStepId |\n| destinationStepId |\n| guideStepPollTypes |\n| language |\n| remoteIp |\n| serverName |\n| country |\n| region |\n| latitude |\n| longitude |\n| tabId |\n| url |\n| userAgent |\n| properties |\n| uiElementid |\n| uiElementType |\n| uiElementText |\n| uiElementActions |`),
'pollEvents': new vscode.MarkdownString(`| **pollEvents** |\n|---------|\n| visitorld |\n| accountId |\n| appId |\n| browserTime |\n| type |\n| guideId |\n| guideStepId |\n| pollId |\n| pollType |\n| pollResponse |\n| language |\n| remoteIp |\n| serverName |\n| country |\n| region |\n| latitude |\n| longitude |\n| tabId |\n| url |\n| userAgent |\n| properties |`),
'guidesSeen': new vscode.MarkdownString(`| **guidesSeen** |\n|---------|\n| visitorld |\n| guideId |\n| guideStepId |\n| firstSeenAt |\n| lastAdvancedAutoAt |\n| lastDismissedAutoAt |\n| lastSeenAt |\n| lastTimeoutAt |\n| seenCount |\n| lastState |`),
'pollsSeen': new vscode.MarkdownString(`| **pollsSeen** |\n|---------|\n| visitorld |\n| guideId |\n| pollId |\n| time |\n| pollResponse |`),
'singleEvents': new vscode.MarkdownString(`| **singleEvents** |\n|---------|\n| visitorld |\n| accountId |\n| appId |\n| hour |\n| day |\n| week |\n| month |\n| quarter |\n| numEvents |\n| numMinutes |\n| remoteIp |\n| server |\n| userAgent |\n| tabId |\n| properties |`),
'emailEvents': new vscode.MarkdownString(`| **emailEvents** |\n|---------|\n| WIP |`)
};

export function activate(context: vscode.ExtensionContext) {
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
