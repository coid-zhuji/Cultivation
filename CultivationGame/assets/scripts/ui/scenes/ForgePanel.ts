import { _decorator, Component, Label, Button, ProgressBar, Color } from 'cc';
import { GameManager } from '../../core/GameManager';
import { getItemConfig, ItemType } from '../../data/ItemConfig';

const { ccclass, property } = _decorator;

/**
 * 炼器面板
 * 打造和强化法宝装备
 */
@ccclass('ForgePanel')
export class ForgePanel extends Component {

    @property(Label)
    public resultLabel: Label | null = null;

    @property(ProgressBar)
    public progressbar: ProgressBar | null = null;

    private _gameManager: GameManager | null = null;
    private _isForging: boolean = false;
    private _forgeProgress: number = 0;

    start() {
        this._gameManager = GameManager.instance;
    }

    /** 开始炼器 */
    public startForging(equipId: string): void {
        if (this._isForging) return;

        const config = getItemConfig(equipId);
        if (!config || config.type !== ItemType.EQUIPMENT) return;

        this._isForging = true;
        this._forgeProgress = 0;

        this.schedule(() => {
            this._forgeProgress += 0.08;
            if (this.progressbar) {
                this.progressbar.progress = this._forgeProgress;
            }

            if (this._forgeProgress >= 1) {
                this.completeForging(equipId);
            }
        }, 0.5);
    }

    /** 炼器完成 */
    private completeForging(equipId: string): void {
        this._isForging = false;
        this.unscheduleAllCallbacks();

        const success = Math.random() < 0.6;
        if (success) {
            if (this._gameManager) {
                this._gameManager.playerManager.addItem(equipId);
            }
            if (this.resultLabel) {
                this.resultLabel.string = '炼器成功！';
                this.resultLabel.color = Color.GREEN;
            }
        } else {
            if (this.resultLabel) {
                this.resultLabel.string = '炼器失败...';
                this.resultLabel.color = Color.RED;
            }
        }
    }

    /** 强化装备 */
    public enhanceEquipment(slot: string): void {
        if (!this._gameManager) return;

        const player = this._gameManager.playerManager;
        if (!player || !player.isInitialized) return;

        const equipId = player.data.equipment[slot];
        if (!equipId) {
            if (this.resultLabel) {
                this.resultLabel.string = '该槽位没有装备';
                this.resultLabel.color = Color.RED;
            }
            return;
        }

        // 强化消耗灵石
        const cost = 500;
        if (!player.consumeSpiritStones(cost)) {
            if (this.resultLabel) {
                this.resultLabel.string = '灵石不足';
                this.resultLabel.color = Color.RED;
            }
            return;
        }

        // 强化成功率
        if (Math.random() < 0.5) {
            // 强化成功，增加属性
            const config = getItemConfig(equipId);
            if (config?.effects) {
                Object.keys(config.effects).forEach(key => {
                    config.effects![key] = Math.floor(config.effects![key] * 1.1);
                });
            }
            if (this.resultLabel) {
                this.resultLabel.string = '强化成功！';
                this.resultLabel.color = Color.GREEN;
            }
        } else {
            if (this.resultLabel) {
                this.resultLabel.string = '强化失败...';
                this.resultLabel.color = Color.RED;
            }
        }
    }
}
