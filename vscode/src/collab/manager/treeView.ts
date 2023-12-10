/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import * as vscode from 'vscode';
import {

  ChatWorkspaceProvider,
  DirectMessagesProvider,
  StreamProvider
} from '../tree';

export class TreeViewManager implements vscode.Disposable {
//   workspacesTreeProvider: WorkspacesTreeProvider;
//   unreadsTreeProvider: UnreadsTreeProvider;
//   channelsTreeProvider: ChannelTreeProvider;
//   imsTreeProvider: IMsTreeProvider;
//   groupsTreeProvider: GroupTreeProvider;

  chatWorkspaceProvider: ChatWorkspaceProvider;
  directMessagesProvider: DirectMessagesProvider;
  streamProvider: StreamProvider;

  constructor(public provider: string) {
    // this.workspacesTreeProvider = new WorkspacesTreeProvider(provider);
    // this.unreadsTreeProvider = new UnreadsTreeProvider(provider);
    // this.channelsTreeProvider = new ChannelTreeProvider(provider);
    // this.groupsTreeProvider = new GroupTreeProvider(provider);
    // this.imsTreeProvider = new IMsTreeProvider(provider);

    this.chatWorkspaceProvider = new ChatWorkspaceProvider(provider);
    this.directMessagesProvider = new DirectMessagesProvider(provider);
    this.streamProvider = new StreamProvider(provider);
  }

  updateData(currentUserInfo: CurrentUser, channelLabels: ChannelLabel[]) {
    // this.workspacesTreeProvider.updateCurrentUser(currentUserInfo);
    // this.unreadsTreeProvider.updateChannels(channelLabels);
    // this.channelsTreeProvider.updateChannels(channelLabels);
    // this.groupsTreeProvider.updateChannels(channelLabels);
    // this.imsTreeProvider.updateChannels(channelLabels);

    this.chatWorkspaceProvider.updateChannels(channelLabels);
    this.directMessagesProvider.updateChannels(channelLabels);
    this.streamProvider.updateChannels(channelLabels);
  }

  dispose() {
    // this.workspacesTreeProvider.dispose();
    // this.unreadsTreeProvider.dispose();
    // this.channelsTreeProvider.dispose();
    // this.groupsTreeProvider.dispose();
    // this.imsTreeProvider.dispose();

    this.chatWorkspaceProvider.dispose();
    this.directMessagesProvider.dispose();
    this.streamProvider.dispose();
  }
}
