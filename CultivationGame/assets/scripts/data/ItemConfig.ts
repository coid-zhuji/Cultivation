import { ElementType } from './PlayerData';

/** 物品品质 */
export enum ItemRarity {
    COMMON = 'common',       // 普通
    UNCOMMON = 'uncommon',   // 优秀
    RARE = 'rare',           // 稀有
    EPIC = 'epic',           // 史诗
    LEGENDARY = 'legendary', // 传说
}

/** 物品类型 */
export enum ItemType {
    PILL = 'pill',           // 丹药
    TECHNIQUE = 'technique', // 功法
    EQUIPMENT = 'equipment', // 装备
    MATERIAL = 'material',   // 材料
    CONSUMABLE = 'consumable', // 消耗品
}

/** 物品配置 */
export interface ItemConfig {
    id: string;
    name: string;
    type: ItemType;
    rarity: ItemRarity;
    description: string;
    /** 售价 */
    price: number;
    /** 堆叠上限 */
    maxStack: number;
    /** 属性加成 */
    effects?: Record<string, number>;
    /** 适配灵根 */
    element?: ElementType;
    /** 图标路径 */
    iconPath: string;
}

/** 丹药配置表 */
export const PillConfigs: ItemConfig[] = [
    {
        id: 'pill_qi_gathering',
        name: '聚气丹',
        type: ItemType.PILL,
        rarity: ItemRarity.COMMON,
        description: '增加灵气获取速度，持续1小时',
        price: 50,
        maxStack: 99,
        effects: { qiRate: 1.5 },
        iconPath: 'textures/items/pill_qi_gathering',
    },
    {
        id: 'pill_foundation',
        name: '筑基丹',
        type: ItemType.PILL,
        rarity: ItemRarity.UNCOMMON,
        description: '筑基突破必备丹药，提升突破成功率20%',
        price: 500,
        maxStack: 10,
        effects: { breakthroughRate: 0.2 },
        iconPath: 'textures/items/pill_foundation',
    },
    {
        id: 'pill_golden_core',
        name: '结丹丹',
        type: ItemType.PILL,
        rarity: ItemRarity.RARE,
        description: '金丹突破必备丹药，提升突破成功率15%',
        price: 2000,
        maxStack: 10,
        effects: { breakthroughRate: 0.15 },
        iconPath: 'textures/items/pill_golden_core',
    },
    {
        id: 'pill_nascent_soul',
        name: '化婴丹',
        type: ItemType.PILL,
        rarity: ItemRarity.EPIC,
        description: '元婴突破必备丹药',
        price: 8000,
        maxStack: 5,
        effects: { breakthroughRate: 0.1 },
        iconPath: 'textures/items/pill_nascent_soul',
    },
    {
        id: 'pill_spirit_separation',
        name: '化神丹',
        type: ItemType.PILL,
        rarity: ItemRarity.EPIC,
        description: '化神突破必备丹药',
        price: 30000,
        maxStack: 5,
        effects: { breakthroughRate: 0.1 },
        iconPath: 'textures/items/pill_spirit_separation',
    },
    {
        id: 'pill_mahayana',
        name: '大乘丹',
        type: ItemType.PILL,
        rarity: ItemRarity.LEGENDARY,
        description: '大乘突破必备丹药',
        price: 100000,
        maxStack: 3,
        effects: { breakthroughRate: 0.05 },
        iconPath: 'textures/items/pill_mahayana',
    },
    {
        id: 'pill_tribulation',
        name: '渡劫丹',
        type: ItemType.PILL,
        rarity: ItemRarity.LEGENDARY,
        description: '渡劫突破必备丹药，可抵挡一次天劫',
        price: 500000,
        maxStack: 1,
        effects: { breakthroughRate: 0.05 },
        iconPath: 'textures/items/pill_tribulation',
    },
    {
        id: 'pill_healing',
        name: '回春丹',
        type: ItemType.PILL,
        rarity: ItemRarity.COMMON,
        description: '恢复灵气100点',
        price: 30,
        maxStack: 99,
        effects: { qiRestore: 100 },
        iconPath: 'textures/items/pill_healing',
    },
];

/** 功法配置表 */
export const TechniqueConfigs: ItemConfig[] = [
    {
        id: 'technique_basic_fire',
        name: '烈火诀',
        type: ItemType.TECHNIQUE,
        rarity: ItemRarity.COMMON,
        description: '基础火系功法，修炼速度+50%',
        price: 200,
        maxStack: 1,
        effects: { cultivationSpeed: 1.5 },
        element: ElementType.FIRE,
        iconPath: 'textures/skills/technique_fire',
    },
    {
        id: 'technique_basic_water',
        name: '碧水诀',
        type: ItemType.TECHNIQUE,
        rarity: ItemRarity.COMMON,
        description: '基础水系功法，修炼速度+50%',
        price: 200,
        maxStack: 1,
        effects: { cultivationSpeed: 1.5 },
        element: ElementType.WATER,
        iconPath: 'textures/skills/technique_water',
    },
    {
        id: 'technique_basic_wood',
        name: '青木诀',
        type: ItemType.TECHNIQUE,
        rarity: ItemRarity.COMMON,
        description: '基础木系功法，修炼速度+50%',
        price: 200,
        maxStack: 1,
        effects: { cultivationSpeed: 1.5 },
        element: ElementType.WOOD,
        iconPath: 'textures/skills/technique_wood',
    },
    {
        id: 'technique_basic_metal',
        name: '庚金诀',
        type: ItemType.TECHNIQUE,
        rarity: ItemRarity.COMMON,
        description: '基础金系功法，修炼速度+50%',
        price: 200,
        maxStack: 1,
        effects: { cultivationSpeed: 1.5 },
        element: ElementType.METAL,
        iconPath: 'textures/skills/technique_metal',
    },
    {
        id: 'technique_basic_earth',
        name: '厚土诀',
        type: ItemType.TECHNIQUE,
        rarity: ItemRarity.COMMON,
        description: '基础土系功法，修炼速度+50%',
        price: 200,
        maxStack: 1,
        effects: { cultivationSpeed: 1.5 },
        element: ElementType.EARTH,
        iconPath: 'textures/skills/technique_earth',
    },
    {
        id: 'technique_advanced_fire',
        name: '焚天诀',
        type: ItemType.TECHNIQUE,
        rarity: ItemRarity.RARE,
        description: '高级火系功法，修炼速度+200%',
        price: 5000,
        maxStack: 1,
        effects: { cultivationSpeed: 3.0 },
        element: ElementType.FIRE,
        iconPath: 'textures/skills/technique_fire_adv',
    },
    {
        id: 'technique_supreme',
        name: '太上道经',
        type: ItemType.TECHNIQUE,
        rarity: ItemRarity.LEGENDARY,
        description: '无上功法，修炼速度+500%，全灵根适配',
        price: 999999,
        maxStack: 1,
        effects: { cultivationSpeed: 6.0 },
        iconPath: 'textures/skills/technique_supreme',
    },
];

/** 装备配置表 */
export const EquipmentConfigs: ItemConfig[] = [
    {
        id: 'equip_sword_iron',
        name: '铁剑',
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        description: '普通铁剑，攻击+5',
        price: 100,
        maxStack: 1,
        effects: { attack: 5 },
        iconPath: 'textures/items/equip_sword_iron',
    },
    {
        id: 'equip_sword_spirit',
        name: '灵剑',
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        description: '蕴含灵气的剑，攻击+20',
        price: 3000,
        maxStack: 1,
        effects: { attack: 20 },
        iconPath: 'textures/items/equip_sword_spirit',
    },
    {
        id: 'equip_armor_cloth',
        name: '布衣',
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        description: '普通布衣，防御+3',
        price: 80,
        maxStack: 1,
        effects: { defense: 3 },
        iconPath: 'textures/items/equip_armor_cloth',
    },
    {
        id: 'equip_armor_spirit',
        name: '灵甲',
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        description: '灵气灌注的护甲，防御+15',
        price: 5000,
        maxStack: 1,
        effects: { defense: 15 },
        iconPath: 'textures/items/equip_armor_spirit',
    },
    {
        id: 'equip_ring_luck',
        name: '幸运戒指',
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.UNCOMMON,
        description: '增加气运+10',
        price: 1000,
        maxStack: 1,
        effects: { luck: 10 },
        iconPath: 'textures/items/equip_ring_luck',
    },
];

/** 所有物品配置汇总 */
export const AllItemConfigs: Map<string, ItemConfig> = new Map([
    ...PillConfigs.map(c => [c.id, c] as [string, ItemConfig]),
    ...TechniqueConfigs.map(c => [c.id, c] as [string, ItemConfig]),
    ...EquipmentConfigs.map(c => [c.id, c] as [string, ItemConfig]),
]);

/** 获取物品配置 */
export function getItemConfig(id: string): ItemConfig | undefined {
    return AllItemConfigs.get(id);
}
