export const CONFIG_ROOT = 'chat';
export const EXTENSION_ID = 'vietis.collab-ai';
export const OUTPUT_CHANNEL_NAME = 'Team Chat';
export const CONFIG_AUTO_LAUNCH = 'chat.autoLaunchLiveShareChat';

// Is there a way to get this url from the vsls extension?
export const LIVE_SHARE_BASE_URL = 'insiders.liveshare.vsengsaas.visualstudio.com';
export const VSLS_EXTENSION_ID = 'ms-vsliveshare.vsliveshare';
export const VSLS_EXTENSION_PACK_ID = 'ms-vsliveshare.vsliveshare-pack';
export const VSLS_SPACES_EXTENSION_ID = 'vsls-contrib.spaces';

export const LiveShareCommands = {
    START: 'liveshare.start',
    END: 'liveshare.end',
    JOIN: 'liveshare.join'
};

export const VSCodeCommands = {
    OPEN: 'vscode.open',
    OPEN_SETTINGS: 'workbench.action.openSettings'
};

export const SelfCommands = {
    OPEN_WEBVIEW: 'extension.collab.openChatPanel',
    CHANGE_WORKSPACE: 'extension.collab.changeWorkspace',
    CHANGE_CHANNEL: 'extension.collab.changeChannel',
    SIGN_IN: 'extension.collab.authenticate',
    SIGN_OUT: 'extension.collab.signout',
    CONFIGURE_TOKEN: 'extension.collab.configureToken',
    LIVE_SHARE_FROM_MENU: 'extension.collab.startLiveShare',
    LIVE_SHARE_SLASH: 'extension.collab.slashLiveShare',
    LIVE_SHARE_SESSION_CHANGED: 'extension.collab.vslsSessionChanged',
    RESET_STORE: 'extension.collab.reset',
    SETUP_NEW_PROVIDER: 'extension.collab.setupNewProvider',
    FETCH_REPLIES: 'extension.collab.fetchReplies',
    UPDATE_MESSAGES: 'extension.collab.updateMessages',
    CLEAR_MESSAGES: 'extension.collab.clearMessages',
    UPDATE_MESSAGE_REPLIES: 'extension.collab.updateReplies',
    UPDATE_PRESENCE_STATUSES: 'extension.collab.updatePresenceStatuses',
    UPDATE_SELF_PRESENCE: 'extension.collab.updateSelfPresence',
    UPDATE_SELF_PRESENCE_VIA_VSLS: 'extension.collab.updateSelfPresenceVsls',
    ADD_MESSAGE_REACTION: 'extension.collab.addMessageReaction',
    REMOVE_MESSAGE_REACTION: 'extension.collab.removeMessageReaction',
    SEND_MESSAGE: 'extension.collab.sendMessage',
    SEND_THREAD_REPLY: 'extension.collab.sendThreadReply',
    SEND_TYPING: 'extension.collab.sendTypingMessage',
    SHOW_TYPING: 'extension.collab.showTypingMessage',
    INVITE_LIVE_SHARE_CONTACT: 'extension.collab.inviteLiveShareContact',
    CHANNEL_MARKED: 'extension.collab.updateChannelMark',
    HANDLE_INCOMING_LINKS: 'extension.collab.handleIncomingLinks',
    SEND_TO_WEBVIEW: 'extension.collab.sendToWebview',
    CHAT_WITH_VSLS_SPACE: 'extension.collab.chatWithSpace',
    VSLS_SPACE_JOINED: 'extension.collab.vslsSpaceJoined'
};

export const SLASH_COMMANDS: any = {
    live: {
        share: {
            action: LiveShareCommands.START,
            options: { suppressNotification: true }
        },
        end: { action: LiveShareCommands.END, options: {} }
    }
};

// Reverse commands are acted on when received from Slack
export const REVERSE_SLASH_COMMANDS = {
    live: {
        request: {}
    }
};
