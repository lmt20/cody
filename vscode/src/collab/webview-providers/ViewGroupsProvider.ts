import * as vscode from 'vscode';

export type ViewGroupItemType = 'inbox' | 'recent' | 'all messages' | 'mentions' | 'starred' | 'drafts'

export class ViewGroupsProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'collab.view';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		}

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)

		webviewView.webview.onDidReceiveMessage(data => {
			switch (data.type) {
				case 'inbox':
					{
						// vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`#${data.value}`))
						console.log('Open view item')
						break
					}
			}
		})
	}


	private _getHtmlForWebview(webview: vscode.Webview) {
		const mediaPath = vscode.Uri.joinPath(this._extensionUri, 'src', 'collab', 'media');
		const commonMediaPath = vscode.Uri.joinPath(mediaPath, 'common');

		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaPath, 'view-groups.js'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaPath, 'view-groups.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(commonMediaPath, 'vscode.css'));  
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(commonMediaPath, 'reset.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">

				<title>Views</title>
			</head>
			<body>
				<ul id="left-sidebar-navigation-list" class="left-sidebar-navigation-list filters">
				<li class="tippy-views-tooltip top_left_inbox top_left_row hidden-for-spectators selected-home-view" data-tooltip-template-id="inbox-tooltip-template">
					<a href="#inbox" tabindex="0" class="left-sidebar-navigation-label-container">
						<span class="filter-icon">
							<i class="zulip-icon zulip-icon-inbox" aria-hidden="true"></i>
						</span><span class="left-sidebar-navigation-label">Inbox</span>
						<span class="unread_count hide"></span>
					</a>
					<span class="arrow sidebar-menu-icon inbox-sidebar-menu-icon hidden-for-spectators"><i class="zulip-icon zulip-icon-more-vertical" aria-hidden="true"></i></span>
				</li>
				<li class="tippy-views-tooltip top_left_recent_view top_left_row" data-tooltip-template-id="recent-conversations-tooltip-template">
					<a href="#recent" class="left-sidebar-navigation-label-container">
						<span class="filter-icon">
							<i class="zulip-icon zulip-icon-clock" aria-hidden="true"></i>
						</span><span class="left-sidebar-navigation-label">Recent conversations</span>
						<span class="unread_count"></span>
					</a>
					<span class="arrow sidebar-menu-icon recent-view-sidebar-menu-icon hidden-for-spectators ">
						<i class="zulip-icon zulip-icon-more-vertical" aria-hidden="true"></i>
					</span>
				</li>
				<li class="tippy-views-tooltip top_left_all_messages top_left_row" data-tooltip-template-id="all-message-tooltip-template">
					<a href="#all_messages" class="home-link left-sidebar-navigation-label-container">
						<span class="filter-icon">
							<i class="zulip-icon zulip-icon-all-messages" aria-hidden="true"></i>
						</span><span class="left-sidebar-navigation-label">All messages</span>
						<span class="unread_count"></span>
					</a>
					<span class="arrow sidebar-menu-icon all-messages-sidebar-menu-icon hidden-for-spectators ">
						<i class="zulip-icon zulip-icon-more-vertical" aria-hidden="true"></i>
					</span>
				</li>
				<li class="top_left_mentions top_left_row hidden-for-spectators">
					<a class="left-sidebar-navigation-label-container" href="#narrow/is/mentioned">
						<span class="filter-icon">
							<i class="zulip-icon zulip-icon-at-sign" aria-hidden="true"></i>
						</span><span class="left-sidebar-navigation-label">Mentions</span>
						<span class="unread_count hide"></span>
					</a>
				</li>
				<li class="top_left_starred_messages top_left_row hidden-for-spectators">
					<a class="left-sidebar-navigation-label-container" href="#narrow/is/starred">
						<span class="filter-icon">
							<i class="zulip-icon zulip-icon-star-filled" aria-hidden="true"></i>
						</span><span class="left-sidebar-navigation-label">Starred messages</span>
						<span class="unread_count hide"></span>
					</a>
					<span class="arrow sidebar-menu-icon starred-messages-sidebar-menu-icon"><i class="zulip-icon zulip-icon-more-vertical" aria-hidden="true"></i></span>
				</li>
				<li class="tippy-left-sidebar-tooltip top_left_drafts top_left_row hidden-for-spectators" data-tooltip-template-id="drafts-tooltip-template">
					<a href="#drafts" class="left-sidebar-navigation-label-container">
						<span class="filter-icon">
							<i class="zulip-icon zulip-icon-drafts" aria-hidden="true"></i>
						</span><span class="left-sidebar-navigation-label">Drafts</span>
						<span class="unread_count hide"></span>
					</a>
					<span class="arrow sidebar-menu-icon drafts-sidebar-menu-icon"><i class="zulip-icon zulip-icon-more-vertical" aria-hidden="true"></i></span>
				</li>
				<li class="top_left_scheduled_messages top_left_row hidden-for-spectators">
					<a class="left-sidebar-navigation-label-container" href="#scheduled">
						<span class="filter-icon">
							<i class="zulip-icon zulip-icon-scheduled-messages" aria-hidden="true"></i>
						</span><span class="left-sidebar-navigation-label">Scheduled messages</span>
						<span class="unread_count hide"></span>
					</a>
				</li>
			</ul>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
