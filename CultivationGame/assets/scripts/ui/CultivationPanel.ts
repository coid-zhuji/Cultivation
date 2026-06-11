import { _decorator, Component, Node, Label, Button, ProgressBar, Color } from 'cc';
import { GameManager } from '../core/GameManager';
import { getRealmConfig, getNextRealm } from '../data/RealmConfig';
import { BreakthroughResult } from '../systems/CultivationSystem';

const { ccclass, property } = _decorator;

/**
 * 修炼面板
 * 修炼操作、突破、功法切换
 */
@ccclass('CultivationPanel')
export class CultivationPanel extends Component {

    @property(Label)
    public realmLabel: Label | null = null;

    @property(Label)
    public nextRealmLabel: Label | null = null;

    @property(ProgressBar)
    public breakthroughProgress: ProgressBar | null = null;

    @property(Label)
    public cultivationRateLabel: Label | null = null;

    @property(Button)
    public cultivateBtn: Button | null = null;

    @property(Button)
    public breakthroughBtn: Button | null = null;

    @property(Label)
    public resultLabel: Label | null = null;

    private _gameManager: GameManager | null = null;

    start() {
        this._gameManager = GameManager.instance;

        // 绑定按钮事件
        if (this.cultivateBtn) {
            this.cultivateBtn.node.on(Button.EventType.CLICK, this.onCultivateClick, this);
        }
        if (this.breakthroughBtn) {
            this.breakthroughBtn.node.on(Button.EventType.CLICK, this.onBreakthroughClick, this);
        }

        this.updateDisplay();
    }

    /** 修炼按钮点击 */
    private onCultivateClick(): void {
        if (!this._gameManager) return;

        const cultivation = this._gameManager.cultivationSystem;
        if (cultivation.isCultivating) {
            cultivation.stopCultivation();
            if (this.cultivateBtn) {
                // 更新按钮文字
                const label = this.cultivateBtn.node.getComponentInChildren(Label);
                if (label) label.string = '开始修炼';
            }
        } else {
            cultivation.startCultivation();
            if (this.cultivateBtn) {
                const label = this.cultivateBtn.node.getComponentInChildren(Label);
                if (label) label.string = '停止修炼';
            }
        }
    }

    /** 突破按钮点击 */
    private onBreakthroughClick(): void {
        if (!this._gameManager) return;

        const result: BreakthroughResult = this._gameManager.cultivationSystem.attemptBreakthrough();

        if (result.success) {
            this.showResult(`突破成功！晋升${result.newRealmName}！`, Color.GREEN);
        } else {
            const qiInfo = result.qiLoss ? `，损失灵气${result.qiLoss}` : '';
            this.showResult(`${result.reason}${qiInfo}`, Color.RED);
        }

        this.updateDisplay();
    }

    /** 显示结果信息 */
    private showResult(text: string, color: Color): void {
        if (this.resultLabel) {
            this.resultLabel.string = text;
            this.resultLabel.color = color;
        }
    }

    /** 更新面板显示 */
    public updateDisplay(): void {
        if (!this._gameManager) return;

        const player = this._gameManager.playerManager;
        if (!player || !player.isInitialized) return;

        const data = player.data;
        const realmConfig = getRealmConfig(data.realm);
        const nextRealm = getNextRealm(data.realm);

        // 当前境界
        if (this.realmLabel) {
            this.realmLabel.string = realmConfig.name;
        }

        // 下一境界
        if (this.nextRealmLabel) {
            if (nextRealm !== null) {
                const nextConfig = getRealmConfig(nextRealm);
                this.nextRealmLabel.string = `下一境界: ${nextConfig.name}`;
            } else {
                this.nextRealmLabel.string = '已达最高境界';
            }
        }

        // 突破进度
        if (this.breakthroughProgress && nextRealm !== null) {
            const nextConfig = getRealmConfig(nextRealm);
            this.breakthroughProgress.progress = data.currentQi / nextConfig.requiredQi;
        }

        // 突破按钮状态
        if (this.breakthroughBtn) {
            this.breakthroughBtn.interactable = player.canBreakthrough();
        }
    }
}
