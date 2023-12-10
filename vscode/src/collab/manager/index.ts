/* eslint-disable @typescript-eslint/explicit-function-return-type */

/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable import/no-default-export */
import * as vscode from 'vscode';
import { ViewsManager } from './views';

export default class Manager implements IManager, vscode.Disposable {
    viewsManager: ViewsManager;

    constructor() {
        this.viewsManager = new ViewsManager(this);
        this.initializeViewsManager();
    }

    initializeViewsManager = () => {
        const enabledProviders = ['zulip'];
        this.viewsManager.initialize(enabledProviders);
    };

    updateTreeViewsForProvider(provider: string) {
        this.viewsManager.updateTreeViews(provider);
    }

    dispose() {
        this.viewsManager.dispose();
    }
}
