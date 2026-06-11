import { _decorator, Component } from 'cc';
import { PlayerData, RealmType, ElementType, createDefaultPlayerData } from '../data/PlayerData';
import { getRealmConfig, getNextRealm } from '../data/RealmConfig';

const { ccclass } = _decorator;

/**
 * 玩家管理器
 * 管理玩家数据的创建、读取、修改
 */
@ccclass('PlayerManager')
export class PlayerManager extends Component {

    private _playerData: PlayerData | null = null;

    public get data(): PlayerData {
        return this._playerData!;
    }

    public get isInitialized(): boolean {
        return this._playerData !== null;
    }

    /** 创建新角色 */
    public createPlayer(name: string, element: ElementType): PlayerData {
        this._playerData = createDefaultPlayerData(name);
        this._playerData.attributes.spiritualRoot = element;
        return this._playerData;
    }

    /** 加载已有角色 */
    public loadPlayer(data: PlayerData): void {
        this._playerData = data;
    }

    /** 获取当前境界名 */
    public getRealmName(): string {
        if (!this._playerData) return '凡人';
        return getRealmConfig(this._playerData.realm).name;
    }

    /** 获取下一个境界名 */
    public getNextRealmName(): string | null {
        if (!this._playerData) return null;
        const next = getNextRealm(this._playerData.realm);
        if (next === null) return null;
        return getRealmConfig(next).name;
    }

    /** 增加灵气 */
    public addQi(amount: number): void {
        if (!this._playerData) return;
        this._playerData.currentQi = Math.min(
            this._playerData.currentQi + amount,
            this._playerData.maxQi
        );
    }

    /** 消耗灵气 */
    public consumeQi(amount: number): boolean {
        if (!this._playerData) return false;
        if (this._playerData.currentQi < amount) return false;
        this._playerData.currentQi -= amount;
        return true;
    }

    /** 增加灵石 */
    public addSpiritStones(amount: number): void {
        if (!this._playerData) return;
        this._playerData.spiritStones += amount;
    }

    /** 消耗灵石 */
    public consumeSpiritStones(amount: number): boolean {
        if (!this._playerData) return false;
        if (this._playerData.spiritStones < amount) return false;
        this._playerData.spiritStones -= amount;
        return true;
    }

    /** 提升境界 */
    public advanceRealm(): boolean {
        if (!this._playerData) return false;
        const nextRealm = getNextRealm(this._playerData.realm);
        if (nextRealm === null) return false;

        const nextConfig = getRealmConfig(nextRealm);
        if (this._playerData.currentQi < nextConfig.requiredQi) return false;

        // 消耗灵气
        this._playerData.currentQi -= nextConfig.requiredQi;
        this._playerData.realm = nextRealm;

        // 提升灵气上限
        this._playerData.maxQi = Math.floor(this._playerData.maxQi * nextConfig.cultivationSpeed);

        return true;
    }

    /** 检查是否可以突破 */
    public canBreakthrough(): boolean {
        if (!this._playerData) return false;
        const nextRealm = getNextRealm(this._playerData.realm);
        if (nextRealm === null) return false;
        const nextConfig = getRealmConfig(nextRealm);
        return this._playerData.currentQi >= nextConfig.requiredQi;
    }

    /** 增加属性 */
    public addAttribute(attr: string, value: number): void {
        if (!this._playerData) return;
        const attrs = this._playerData.attributes as any;
        if (attr in attrs) {
            attrs[attr] += value;
        }
    }

    /** 添加物品到背包 */
    public addItem(itemId: string, count: number = 1): void {
        if (!this._playerData) return;
        const existing = this._playerData.inventory.find(i => i.itemId === itemId);
        if (existing) {
            existing.count += count;
        } else {
            this._playerData.inventory.push({ itemId, count });
        }
    }

    /** 移除背包物品 */
    public removeItem(itemId: string, count: number = 1): boolean {
        if (!this._playerData) return false;
        const existing = this._playerData.inventory.find(i => i.itemId === itemId);
        if (!existing || existing.count < count) return false;
        existing.count -= count;
        if (existing.count <= 0) {
            this._playerData.inventory = this._playerData.inventory.filter(i => i.itemId !== itemId);
        }
        return true;
    }

    /** 检查背包是否有物品 */
    public hasItem(itemId: string, count: number = 1): boolean {
        if (!this._playerData) return false;
        const existing = this._playerData.inventory.find(i => i.itemId === itemId);
        return existing !== undefined && existing.count >= count;
    }

    /** 装备物品 */
    public equipItem(slot: string, itemId: string): void {
        if (!this._playerData) return;
        this._playerData.equipment[slot] = itemId;
    }

    /** 卸下装备 */
    public unequipItem(slot: string): string | null {
        if (!this._playerData) return null;
        const itemId = this._playerData.equipment[slot];
        this._playerData.equipment[slot] = null;
        return itemId;
    }
}
