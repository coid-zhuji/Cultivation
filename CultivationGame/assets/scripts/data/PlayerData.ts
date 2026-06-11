/** 境界枚举 */
export enum RealmType {
    MORTAL = 0,       // 凡人
    QI_CONDENSING = 1, // 练气
    FOUNDATION = 2,    // 筑基
    GOLDEN_CORE = 3,   // 金丹
    NASCENT_SOUL = 4,  // 元婴
    SPIRIT_SEPARATION = 5, // 化神
    MAHAYANA = 6,      // 大乘
    TRIBULATION = 7,   // 渡劫
    IMMORTAL = 8,      // 仙人
}

/** 境界配置 */
export interface RealmConfig {
    type: RealmType;
    name: string;
    description: string;
    /** 突破所需灵气 */
    requiredQi: number;
    /** 突破成功率基础值 */
    breakthroughRate: number;
    /** 修炼速度倍率 */
    cultivationSpeed: number;
    /** 突破所需物品 */
    requiredItems: { itemId: string; count: number }[];
}

/** 五行灵根 */
export enum ElementType {
    METAL = 'metal',  // 金
    WOOD = 'wood',    // 木
    WATER = 'water',  // 水
    FIRE = 'fire',    // 火
    EARTH = 'earth',  // 土
}

/** 玩家属性 */
export interface PlayerAttributes {
    /** 根骨 - 影响修炼速度 */
    constitution: number;
    /** 悟性 - 影响功法领悟效率 */
    comprehension: number;
    /** 气运 - 影响随机事件触发 */
    luck: number;
    /** 灵根 - 五行属性 */
    spiritualRoot: ElementType;
}

/** 玩家数据 */
export interface PlayerData {
    name: string;
    realm: RealmType;
    attributes: PlayerAttributes;
    /** 当前灵气 */
    currentQi: number;
    /** 灵气上限 */
    maxQi: number;
    /** 灵石 */
    spiritStones: number;
    /** 当前修炼功法ID */
    currentTechnique: string | null;
    /** 已学功法列表 */
    learnedTechniques: string[];
    /** 背包物品 */
    inventory: InventoryItem[];
    /** 装备栏 */
    equipment: Record<string, string | null>;
    /** 游戏时间（秒） */
    gameTime: number;
    /** 创建时间 */
    createdTime: number;
}

/** 背包物品 */
export interface InventoryItem {
    itemId: string;
    count: number;
}

/** 创建默认玩家数据 */
export function createDefaultPlayerData(name: string): PlayerData {
    return {
        name: name,
        realm: RealmType.MORTAL,
        attributes: {
            constitution: 10,
            comprehension: 10,
            luck: 10,
            spiritualRoot: ElementType.FIRE,
        },
        currentQi: 0,
        maxQi: 100,
        spiritStones: 100,
        currentTechnique: null,
        learnedTechniques: [],
        inventory: [],
        equipment: {
            weapon: null,
            armor: null,
            accessory: null,
        },
        gameTime: 0,
        createdTime: Date.now(),
    };
}
