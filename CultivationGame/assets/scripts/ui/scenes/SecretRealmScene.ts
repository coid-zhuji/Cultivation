import { _decorator, Component, Node, Label, Button, Color } from 'cc';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

/** 秘境事件类型 */
export enum SecretEventType {
    BATTLE = 'battle',       // 战斗
    TREASURE = 'treasure',   // 宝箱
    ENCOUNTER = 'encounter', // 奇遇
    TRAP = 'trap',           // 陷阱
}

/** 秘境事件 */
export interface SecretEvent {
    type: SecretEventType;
    title: string;
    description: string;
    /** 成功奖励 */
    reward?: { itemId?: string; qi?: number; spiritStones?: number };
    /** 失败惩罚 */
    penalty?: { qi?: number; spiritStones?: number };
    /** 成功率 */
    successRate: number;
}

/** 秘境事件模板 */
const SECRET_EVENTS: SecretEvent[] = [
    {
        type: SecretEventType.BATTLE,
        title: '妖兽出没',
        description: '前方发现一只妖兽，是否挑战？',
        reward: { qi: 50, spiritStones: 100 },
        penalty: { qi: 30 },
        successRate: 0.7,
    },
    {
        type: SecretEventType.TREASURE,
        title: '发现宝箱',
        description: '角落里有一个古老的宝箱',
        reward: { spiritStones: 200 },
        successRate: 0.9,
    },
    {
        type: SecretEventType.ENCOUNTER,
        title: '仙人遗府',
        description: '发现一处仙人遗留的洞府',
        reward: { qi: 200, spiritStones: 500 },
        penalty: { qi: 50 },
        successRate: 0.5,
    },
    {
        type: SecretEventType.TRAP,
        title: '阵法陷阱',
        description: '不小心触发了古老阵法',
        penalty: { qi: 100 },
        successRate: 0.3,
    },
];

/**
 * 秘境场景
 * 随机事件探索
 */
@ccclass('SecretRealmScene')
export class SecretRealmScene extends Component {

    @property(Label)
    public eventTitleLabel: Label | null = null;

    @property(Label)
    public eventDescLabel: Label | null = null;

    @property(Button)
    public exploreBtn: Button | null = null;

    @property(Button)
    public acceptBtn: Button | null = null;

    @property(Button)
    public declineBtn: Button | null = null;

    @property(Label)
    public resultLabel: Label | null = null;

    private _gameManager: GameManager | null = null;
    private _currentEvent: SecretEvent | null = null;

    start() {
        this._gameManager = GameManager.instance;

        if (this.exploreBtn) {
            this.exploreBtn.node.on(Button.EventType.CLICK, this.onExplore, this);
        }
        if (this.acceptBtn) {
            this.acceptBtn.node.on(Button.EventType.CLICK, this.onAccept, this);
        }
        if (this.declineBtn) {
            this.declineBtn.node.on(Button.EventType.CLICK, this.onDecline, this);
        }

        this.hideEvent();
    }

    /** 探索 */
    private onExplore(): void {
        const event = this.getRandomEvent();
        this._currentEvent = event;
        this.showEvent(event);
    }

    /** 接受事件 */
    private onAccept(): void {
        if (!this._currentEvent || !this._gameManager) return;

        const roll = Math.random();
        if (roll <= this._currentEvent.successRate) {
            this.applyReward(this._currentEvent);
        } else {
            this.applyPenalty(this._currentEvent);
        }

        this.hideEvent();
    }

    /** 拒绝事件 */
    private onDecline(): void {
        this._currentEvent = null;
        this.hideEvent();
    }

    /** 获取随机事件 */
    private getRandomEvent(): SecretEvent {
        const index = Math.floor(Math.random() * SECRET_EVENTS.length);
        return { ...SECRET_EVENTS[index] };
    }

    /** 显示事件 */
    private showEvent(event: SecretEvent): void {
        if (this.eventTitleLabel) this.eventTitleLabel.string = event.title;
        if (this.eventDescLabel) this.eventDescLabel.string = event.description;
        if (this.acceptBtn) this.acceptBtn.node.active = true;
        if (this.declineBtn) this.declineBtn.node.active = true;
        if (this.exploreBtn) this.exploreBtn.node.active = false;
    }

    /** 隐藏事件 */
    private hideEvent(): void {
        if (this.acceptBtn) this.acceptBtn.node.active = false;
        if (this.declineBtn) this.declineBtn.node.active = false;
        if (this.exploreBtn) this.exploreBtn.node.active = true;
    }

    /** 应用奖励 */
    private applyReward(event: SecretEvent): void {
        if (!this._gameManager) return;
        const player = this._gameManager.playerManager;
        if (!player) return;

        if (event.reward?.qi) player.addQi(event.reward.qi);
        if (event.reward?.spiritStones) player.addSpiritStones(event.reward.spiritStones);
        if (event.reward?.itemId) player.addItem(event.reward.itemId);

        if (this.resultLabel) {
            let text = '探索成功！获得: ';
            if (event.reward?.qi) text += `灵气+${event.reward.qi} `;
            if (event.reward?.spiritStones) text += `灵石+${event.reward.spiritStones} `;
            this.resultLabel.string = text;
            this.resultLabel.color = Color.GREEN;
        }
    }

    /** 应用惩罚 */
    private applyPenalty(event: SecretEvent): void {
        if (!this._gameManager) return;
        const player = this._gameManager.playerManager;
        if (!player) return;

        if (event.penalty?.qi) player.consumeQi(event.penalty.qi);
        if (event.penalty?.spiritStones) player.consumeSpiritStones(event.penalty.spiritStones);

        if (this.resultLabel) {
            let text = '探索失败！损失: ';
            if (event.penalty?.qi) text += `灵气-${event.penalty.qi} `;
            if (event.penalty?.spiritStones) text += `灵石-${event.penalty.spiritStones} `;
            this.resultLabel.string = text;
            this.resultLabel.color = Color.RED;
        }
    }
}
