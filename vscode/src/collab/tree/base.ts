/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as vscode from 'vscode';
import { ChannelTreeItem } from './treeItem';
import { equals, notUndefined } from '../utils';

export type ISortingFunction = (a: ChannelLabel, b: ChannelLabel) => number;

export type IFilterFunction = (a: ChannelLabel) => boolean;

export class BaseChannelsListTreeProvider
  implements vscode.TreeDataProvider<ChatTreeNode>, vscode.Disposable {
  private _onDidChangeTreeData = new vscode.EventEmitter<ChatTreeNode>();
  public readonly onDidChangeTreeData? = this._onDidChangeTreeData.event;
  protected _disposables: vscode.Disposable[] = [];

  protected sortingFn: ISortingFunction = (a: ChannelLabel, b: ChannelLabel) =>
    a.label.localeCompare(b.label);
  protected filterFn: IFilterFunction = () => true;
  protected channelLabels: ChannelLabel[] = [];
  private treeData: ChatTreeNode[] = [];

  constructor(protected providerName: string, protected viewId: string) {
    this._disposables.push(
      vscode.window.registerTreeDataProvider(this.viewId, this)
    );
    for (let i = 1; i <= 5; i++) {
        const node: ChatTreeNode = {
            label: `Channel ${i}`,
            channel: { id: `Channel ${i}`, name: `Channel ${i}`},
            team: { id: 'team1', name: 'Team A' },
            isCategory: false,
            presence: UserPresence.available,
            providerName: 'Provider A',
        };
        this.treeData.push(node);
    }
  }

  dispose() {
    this._disposables.forEach(dispose => dispose.dispose());
  }

  async refresh(treeItem?: ChatTreeNode) {
    if (treeItem) {
      this._onDidChangeTreeData.fire(treeItem);
    }
  }

  getLabelsObject(
    channeLabels: ChannelLabel[]
  ): { [channelId: string]: ChannelLabel } {
    const result: { [channelId: string]: ChannelLabel } = {};
    channeLabels.forEach(label => {
      const { channel } = label;
      result[channel.id] = label;
    });
    return result;
  }

  updateChannels(channelLabels: ChannelLabel[]) {
    const filtered = channelLabels.filter(this.filterFn).sort(this.sortingFn);
    const prevLabels = this.getLabelsObject(this.channelLabels);
    const newLabels = this.getLabelsObject(filtered);
    this.channelLabels = filtered;
    const prevKeys = new Set(Object.keys(prevLabels));
    const newKeys = new Set(Object.keys(newLabels));

    if (!equals(prevKeys, newKeys)) {
      // We have new channels, so we are replacing everything
      // Can potentially optimize this
      return this.refresh();
    }

    // Looking for changes in presence and unread
    Object.keys(newLabels).forEach(channelId => {
      const newLabel = newLabels[channelId];
      const prevLabel = prevLabels[channelId];

      if (prevLabel.unread !== newLabel.unread) {
        // Can we send just this element?
        void this.refresh();
      }

      if (prevLabel.presence !== newLabel.presence) {
        // Can we send just this element?
        void this.refresh();
      }
    });
  }

  getParent = (element: ChatTreeNode): vscode.ProviderResult<ChatTreeNode> => {
    const { channel } = element;

    if (!!channel && !!channel.categoryName) {
      return Promise.resolve(this.getItemForCategory(channel.categoryName));
    }
  };

  getChildren = (
    element?: ChatTreeNode
  ): vscode.ProviderResult<ChatTreeNode[]> => {
    // if (!element) {
    //   return this.getRootChildren();
    // }

    // if (!!element && element.isCategory) {
    //   return this.getChildrenForCategory(element);
    // }
    if (element) {
        // If element has children, return them (for a more complex tree structure)
        return [];
    } 
        // If element is undefined, return the top-level nodes
        return this.treeData;
    
  };

  getChildrenForCategory = (
    element: ChatTreeNode
  ): vscode.ProviderResult<ChatTreeNode[]> => {
    const { label: category } = element;
    const channels = this.channelLabels
      .filter(channelLabel => {
        const { channel } = channelLabel;
        return channel.categoryName === category;
      })
      .map(this.getItemForChannel);
    return Promise.resolve(channels);
  };

  getRootChildren = (): vscode.ProviderResult<ChatTreeNode[]> => {
    const channelsWithoutCategories = this.channelLabels
      .filter(channelLabel => !channelLabel.channel.categoryName)
      .map(this.getItemForChannel);
    const categories: string[] = this.channelLabels
      .map(channelLabel => channelLabel.channel.categoryName)
      .filter(notUndefined);
    const uniqueCategories = categories
      .filter((item, pos) => categories.indexOf(item) === pos)
      .map(category => this.getItemForCategory(category));
    return Promise.resolve([...channelsWithoutCategories, ...uniqueCategories]);
  };

  getItemForChannel = (channelLabel: ChannelLabel): ChatTreeNode => {
    const { label, presence, channel } = channelLabel;
    return {
      label,
      presence,
      channel,
      isCategory: false,
      user: undefined,
      team: undefined,
      providerName: this.providerName
    };
  };

  getItemForCategory = (category: string): ChatTreeNode => {
    return {
      label: category,
      presence: UserPresence.unknown,
      isCategory: true,
      channel: undefined,
      user: undefined,
      team: undefined,
      providerName: this.providerName
    };
  };

  getTreeItem = (element: ChatTreeNode): vscode.TreeItem => {
    const { label, presence, isCategory, channel, user } = element;
    const treeItem = new ChannelTreeItem(
      label,
      presence,
      isCategory,
      this.providerName,
      channel,
      user
    );
    return treeItem;
  };
}
