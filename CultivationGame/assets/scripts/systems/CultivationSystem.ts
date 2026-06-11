import { _decorator, Component } from 'cc';
import { PlayerData, RealmType } from '../data/PlayerData';
import { getRealmConfig, getNextRealm } from '../data/RealmConfig';

const { ccclass } = _decorator;

/**
 * 修炼系统
 * 处理修炼逻辑、灵气获取、境界突破
 */
@ccclass('CultivationSystem')
export class CultivationSystem extends Component {

    /** 基础修炼速度（灵气/秒） */
    private readonly BASE_CULTIVATION_RATE = 1;

    /** 是否正在修炼 */
    private _isCultivating: boolean = false;

    /** 修炼加成倍率 */
    private _cultivationBonus: number = 1.0;

    public get isCultivating(): boolean {
        return this._isCultivating;
    }

    public get cultivationBonus(): number {
        return this._cultivationBonus;
    }

    /** 开始修炼 */
    public startCultivation(): void {
        if (this._isCultivating) return;
        this._isCultivating = true;
        console.log('[CultivationSystem] 开始修炼');
    }

    /** 停止修炼 */
    public stopCultivation(): void {
        if (!this._isCultivating) return;
        this._isCultivating = false;
        console.log('[CultivationSystem] 停止修炼');
    }

    /** 设置修炼加成 */
    public setCultivationBonus(bonus: number): void {
        this._cultivationBonus = Math.max(1, bonus);
    }

    /** 每秒逻辑帧 */
    public onTick(timeScale: number): void {
        if (!this._isCultivating) return;

        const gameManager = this.getComponent('GameManager') as any;
        if (!gameManager) return;

        const playerManager = gameManager.playerManager;
        if (!playerManager) return;

        // 计算修炼速度
        const rate = this.calculateCultivationRate(playerManager.data);
        const qiGain = rate * timeScale;

        // 增加灵气
        playerManager.addQi(qiGain);
    }

    /** 计算修炼速度 */
    private calculateCultivationRate(playerData: PlayerData): number {
        const realmConfig = getRealmConfig(playerData.realm);
        const constitutionBonus = playerData.attributes.constitution / 10;
        const techniqueBonus = this._cultivationBonus;

        return this.BASE_CULTIVATION_RATE * realmConfig.cultivationSpeed * constitutionBonus * techniqueBonus;
    }

    /** 尝试突破 */
    public attemptBreakthrough(): BreakthroughResult {
        const gameManager = this.getComponent('GameManager') as any;
        if (!gameManager) return { success: false, reason: '系统错误' };

        const playerManager = gameManager.playerManager;
        if (!playerManager) return { success: false, reason: '系统错误' };

        const currentRealm = playerManager.data.realm;
        const nextRealm = getNextRealm(currentRealm);

        if (nextRealm === null) {
            return { success: false, reason: '已达最高境界' };
        }

        const nextConfig = getRealmConfig(nextRealm);

        // 检查灵气是否足够
        if (playerManager.data.currentQi < nextConfig.requiredQi) {
            return { success: false, reason: '灵气不足' };
        }

        // 检查突破物品
        for (const item of nextConfig.requiredItems) {
            if (!playerManager.hasItem(item.itemId, item.count)) {
                return { success: false, reason: `缺少突破材料` };
            }
        }

        // 计算突破成功率
        const baseRate = nextConfig.breakthroughRate;
        const luckBonus = playerManager.data.attributes.luck / 100;
        const finalRate = Math.min(baseRate + luckBonus, 0.99);

        // 随机判定
        const roll = Math.random();
        if (roll <= finalRate) {
            // 突破成功
            // 消耗突破物品
            for (const item of nextConfig.requiredItems) {
                playerManager.removeItem(item.itemId, item.count);
            }
            playerManager.advanceRealm();

            return {
                success: true,
                newRealm: nextRealm,
                newRealmName: getRealmConfig(nextRealm).name,
            };
        } else {
            // 突破失败，损失部分灵气
            const qiLoss = Math.floor(playerManager.data.currentQi * 0.1);
            playerManager.consumeQi(qiLoss);

            return {
                success: false,
                reason: '突破失败，天意不允',
                qiLoss: qiLoss,
            };
        }
    }
}

/** 突破结果 */
export interface BreakthroughResult {
    success: boolean;
    reason?: string;
    newRealm?: RealmType;
    newRealmName?: string;
    qiLoss?: number;
}
