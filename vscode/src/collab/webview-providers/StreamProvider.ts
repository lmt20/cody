import * as vscode from 'vscode';

export class StreamProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'collab.stream';


	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		webviewView.webview.options = {
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const mediaPath = vscode.Uri.joinPath(this._extensionUri, 'src', 'collab', 'media');
		const commonMediaPath = vscode.Uri.joinPath(mediaPath, 'common');

		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaPath, 'stream.js'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaPath, 'stream.css'));
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

				<title>Direct Messages</title>
			</head>
			<body>
                <ul class="direct-message-list">
                    <li class="">
                        <a href="" tabindex="0" class="">
                            <span class="">
                                <i class="" aria-hidden="true"></i>
                            </span><span class="">core team</span>
                            <span class="unread_count hide"></span>
                        </a>
                        <span class="a"><i class="" aria-hidden="true"></i></span>
                    </li>
                    <li class="">
                        <a href="" tabindex="0" class="">
                            <span class="">
                                <i class="" aria-hidden="true"></i>
                            </span><span class="">general</span>
                            <span class="unread_count hide"></span>
                        </a>
                        <span class="a"><i class="" aria-hidden="true"></i></span>
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
