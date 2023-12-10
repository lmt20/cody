/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as vscode from 'vscode';
import { TreeViewManager } from './treeView';
import { setVsContext, difference } from '../utils';

const PROVIDERS_WITH_TREE = ['zulip'];

export class ViewsManager implements vscode.Disposable {
    treeViews: Map<string, TreeViewManager> = new Map();

    constructor(private parentManager: IManager) {}

    initialize(enabledProviders: string[]) {
        this.initializeTreeViews(enabledProviders);
    }

    initializeTreeViews(enabledProviders: string[]) {
        PROVIDERS_WITH_TREE.forEach(provider => {
            const hasProviderEnabled = enabledProviders.includes(provider);
            setVsContext(`chat:${provider}`, hasProviderEnabled);
        });

        const enabledTreeProviders = new Set(enabledProviders.filter(p => PROVIDERS_WITH_TREE.includes(p)));
        const existingTreeProviders = new Set(Array.from(this.treeViews.keys()));
        const treesToAdd = difference(enabledTreeProviders, existingTreeProviders);
        const treesToRemove = difference(existingTreeProviders, enabledTreeProviders);

        treesToRemove.forEach(treeProvider => {
            const treeView = this.treeViews.get(treeProvider);
            if (treeView) {
                treeView.dispose();
                this.treeViews.delete(treeProvider);
            }
        });

        treesToAdd.forEach(treeProvider => {
            this.treeViews.set(treeProvider, new TreeViewManager(treeProvider));
        });
    }

    updateTreeViews(provider: string) {
        // const treeViewForProvider = this.treeViews.get(provider);

        // if (!!treeViewForProvider) {
        //     const channelLabels = this.parentManager.getChannelLabels(provider);
        //     const currentUserInfo = this.parentManager.getCurrentUserFor(provider);

        //     if (currentUserInfo) {
        //         treeViewForProvider.updateData(currentUserInfo, channelLabels);
        //     }
        // }
    }

    dispose() {
        for (const entry of Array.from(this.treeViews.entries())) {
            const treeView = entry[1];
            treeView.dispose();
        }
    }
}
