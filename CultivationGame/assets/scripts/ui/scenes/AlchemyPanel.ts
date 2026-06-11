import { _decorator, Component, Label, Button, ProgressBar, Color } from 'cc';
import { GameManager } from '../../core/GameManager';
import { PillConfigs, getItemConfig, ItemType } from '../../data/ItemConfig';

const { ccclass, property } = _decorator;

/**
 * 炼丹面板
 * 炼制丹药
 */
@ccclass('AlchemyPanel')
export class AlchemyPanel extends Component {

    @property(Label)
    public resultLabel: Label | null = null;

    @property(ProgressBar)
    public progressbar: ProgressBar | null = null;

    private _gameManager: GameManager | null = null;
    private _isRefining: boolean = false;
    private _refineProgress: number = 0;

    start() {
        this._gameManager = GameManager.instance;
    }

    /** 开始炼丹 */
    public startRefining(pillId: string): void {
        if (this._isRefining) return;

        const config = getItemConfig(pillId);
        if (!config || config.type !== ItemType.PILL) return;

        this._isRefining = true;
        this._refineProgress = 0;

        // 模拟炼丹过程
        this.schedule(() => {
            this._refineProgress += 0.1;
            if (this.progressbar) {
                this.progressbar.progress = this._refineProgress;
            }

            if (this._refineProgress >= 1) {
                this.completeRefining(pillId);
            }
        }, 0.5);
    }

    /** 炼丹完成 */
    private completeRefining(pillId: string): void {
        this._isRefining = false;
        this.unscheduleAllCallbacks();

        // 炼丹成功率
        const success = Math.random() < 0.7;
        if (success) {
            if (this._gameManager) {
                this._gameManager.playerManager.addItem(pillId);
            }
            if (this.resultLabel) {
                this.resultLabel.string = '炼丹成功！';
                this.resultLabel.color = Color.GREEN;
            }
        } else {
            if (this.resultLabel) {
                this.resultLabel.string = '炼丹失败...';
                this.resultLabel.color = Color.RED;
            }
        }
    }
}
