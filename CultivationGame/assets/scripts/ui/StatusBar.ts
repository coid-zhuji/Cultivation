import { _decorator, Component, Node, Label, ProgressBar, Sprite, SpriteFrame, UITransform, Color } from 'cc';
import { GameManager } from '../core/GameManager';
import { RealmType } from '../data/PlayerData';
import { getRealmConfig } from '../data/RealmConfig';

const { ccclass, property } = _decorator;

/**
 * 顶部状态栏
 * 显示灵气、灵石、境界、游戏时间
 */
@ccclass('StatusBar')
export class StatusBar extends Component {

    @property(Label)
    public realmLabel: Label | null = null;

    @property(Label)
    public qiLabel: Label | null = null;

    @property(Label)
    public spiritStoneLabel: Label | null = null;

    @property(Label)
    public timeLabel: Label | null = null;

    @property(ProgressBar)
    public qiProgressBar: ProgressBar | null = null;

    private _gameManager: GameManager | null = null;

    start() {
        this._gameManager = GameManager.instance;
        if (this._gameManager) {
            this._gameManager.eventSystem.on('game-tick', this.onGameTick, this);
        }
    }

    /** 游戏帧更新UI */
    private onGameTick(gameTime: number): void {
        this.updateDisplay(gameTime);
    }

    /** 更新显示 */
    public updateDisplay(gameTime?: number): void {
        if (!this._gameManager) return;

        const player = this._gameManager.playerManager;
        if (!player || !player.isInitialized) return;

        const data = player.data;

        // 境界
        if (this.realmLabel) {
            this.realmLabel.string = getRealmConfig(data.realm).name;
        }

        // 灵气
        if (this.qiLabel) {
            this.qiLabel.string = `${Math.floor(data.currentQi)} / ${data.maxQi}`;
        }

        // 灵气进度条
        if (this.qiProgressBar) {
            this.qiProgressBar.progress = data.currentQi / data.maxQi;
        }

        // 灵石
        if (this.spiritStoneLabel) {
            this.spiritStoneLabel.string = `${Math.floor(data.spiritStones)}`;
        }

        // 游戏时间
        if (this.timeLabel && gameTime !== undefined) {
            const hours = Math.floor(gameTime / 3600);
            const minutes = Math.floor((gameTime % 3600) / 60);
            this.timeLabel.string = `${hours}时${minutes}分`;
        }
    }

    protected onDestroy(): void {
        if (this._gameManager) {
            this._gameManager.eventSystem.off('game-tick', this.onGameTick, this);
        }
    }
}
