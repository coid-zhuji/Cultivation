import { _decorator, Component } from 'cc';
import { ItemType, getItemConfig } from '../data/ItemConfig';

const { ccclass } = _decorator;

/**
 * 资源管理器
 * 管理灵气产出、灵石获取、物品使用
 */
@ccclass('ResourceManager')
export class ResourceManager extends Component {

    /** 灵石产出速率（每秒） */
    private readonly BASE_SPIRIT_STONE_RATE = 0.1;

    /** 每秒逻辑帧 */
    public onTick(timeScale: number): void {
        const gameManager = this.getComponent('GameManager') as any;
        if (!gameManager) return;

        const playerManager = gameManager.playerManager;
        if (!playerManager) return;

        // 被动灵石产出
        const stoneRate = this.calculateSpiritStoneRate(playerManager.data.realm);
        playerManager.addSpiritStones(stoneRate * timeScale);
    }

    /** 计算灵石产出速率 */
    private calculateSpiritStoneRate(realm: number): number {
        return this.BASE_SPIRIT_STONE_RATE * (1 + realm * 0.5);
    }

    /** 使用丹药 */
    public usePill(itemId: string): UsePillResult {
        const gameManager = this.getComponent('GameManager') as any;
        if (!gameManager) return { success: false, reason: '系统错误' };

        const playerManager = gameManager.playerManager;
        if (!playerManager) return { success: false, reason: '系统错误' };

        const itemConfig = getItemConfig(itemId);
        if (!itemConfig || itemConfig.type !== ItemType.PILL) {
            return { success: false, reason: '无效的丹药' };
        }

        if (!playerManager.hasItem(itemId)) {
            return { success: false, reason: '背包中没有该丹药' };
        }

        // 消耗丹药
        playerManager.removeItem(itemId);

        // 应用效果
        if (itemConfig.effects) {
            if (itemConfig.effects.qiRestore) {
                playerManager.addQi(itemConfig.effects.qiRestore);
            }
            if (itemConfig.effects.qiRate) {
                // 临时修炼加速，通过事件通知
                gameManager.eventSystem.emit('pill-qi-rate', itemConfig.effects.qiRate);
            }
            if (itemConfig.effects.breakthroughRate) {
                gameManager.eventSystem.emit('pill-breakthrough-rate', itemConfig.effects.breakthroughRate);
            }
        }

        return { success: true, pillName: itemConfig.name };
    }

    /** 出售物品 */
    public sellItem(itemId: string, count: number = 1): SellResult {
        const gameManager = this.getComponent('GameManager') as any;
        if (!gameManager) return { success: false, reason: '系统错误' };

        const playerManager = gameManager.playerManager;
        if (!playerManager) return { success: false, reason: '系统错误' };

        const itemConfig = getItemConfig(itemId);
        if (!itemConfig) {
            return { success: false, reason: '无效物品' };
        }

        if (!playerManager.hasItem(itemId, count)) {
            return { success: false, reason: '物品数量不足' };
        }

        // 计算售价（半价）
        const sellPrice = Math.floor(itemConfig.price * 0.5 * count);

        playerManager.removeItem(itemId, count);
        playerManager.addSpiritStones(sellPrice);

        return { success: true, sellPrice, itemName: itemConfig.name };
    }

    /** 购买物品 */
    public buyItem(itemId: string, count: number = 1): BuyResult {
        const gameManager = this.getComponent('GameManager') as any;
        if (!gameManager) return { success: false, reason: '系统错误' };

        const playerManager = gameManager.playerManager;
        if (!playerManager) return { success: false, reason: '系统错误' };

        const itemConfig = getItemConfig(itemId);
        if (!itemConfig) {
            return { success: false, reason: '无效物品' };
        }

        const totalPrice = itemConfig.price * count;
        if (playerManager.data.spiritStones < totalPrice) {
            return { success: false, reason: '灵石不足' };
        }

        playerManager.consumeSpiritStones(totalPrice);
        playerManager.addItem(itemId, count);

        return { success: true, totalPrice, itemName: itemConfig.name };
    }
}

export interface UsePillResult {
    success: boolean;
    reason?: string;
    pillName?: string;
}

export interface SellResult {
    success: boolean;
    reason?: string;
    sellPrice?: number;
    itemName?: string;
}

export interface BuyResult {
    success: boolean;
    reason?: string;
    totalPrice?: number;
    itemName?: string;
}
