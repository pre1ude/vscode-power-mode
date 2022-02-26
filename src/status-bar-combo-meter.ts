import * as vscode from 'vscode';
import { Plugin, PowermodeChangeTextDocumentEventData } from './plugin';

export interface StatusBarItemConfig {
    enableStatusBarComboCounter?: boolean;
}

export class StatusBarComboMeter implements Plugin {

    private config: StatusBarItemConfig = {};
    private statusBarItem: vscode.StatusBarItem;

    public activate = () => {
        if (this.statusBarItem) {
            return;
        }
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this.statusBarItem.show();
    }

    dispose = () => {
        if (!this.statusBarItem) {
            return;
        }
        this.statusBarItem.dispose();
        this.statusBarItem = null;
    }

    public onPowermodeStart = (combo: number) => {
        // Do nothing
    }

    public onPowermodeStop = (combo: number) => {
        // Do nothing
    }

    public onComboStart = (combo: number) => {
        this.updateStatusBar(combo);
    }

    public onComboStop = (combo: number) => {
        this.updateStatusBar(combo);
    }

    public onDidChangeTextDocument = (data: PowermodeChangeTextDocumentEventData, event: vscode.TextDocumentChangeEvent) => {
        this.updateStatusBar(data.currentCombo, data.isPowermodeActive);
    }

    public onDidChangeConfiguration = (config: vscode.WorkspaceConfiguration) => {
        this.config.enableStatusBarComboCounter = config.get<boolean>('enableStatusBarComboCounter', true);
        if (this.config.enableStatusBarComboCounter) {
            this.activate();
        } else {
            this.dispose();
        }
    }

    private updateStatusBar = (combo: number, powermode?: boolean) => {
        if (!this.statusBarItem) {
            return;
        }
        const prefix = powermode ? 'POWER MODE!!! ' : '';
        this.statusBarItem.text = `${prefix}Combo: ${combo}`;
    }
}