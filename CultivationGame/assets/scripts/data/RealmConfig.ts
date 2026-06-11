import { RealmType, RealmConfig } from './PlayerData';

/** 境界配置表 */
export const RealmConfigs: Map<RealmType, RealmConfig> = new Map([
    [RealmType.MORTAL, {
        type: RealmType.MORTAL,
        name: '凡人',
        description: '凡夫俗子，尚未踏入修仙之路',
        requiredQi: 0,
        breakthroughRate: 1.0,
        cultivationSpeed: 1.0,
        requiredItems: [],
    }],
    [RealmType.QI_CONDENSING, {
        type: RealmType.QI_CONDENSING,
        name: '练气',
        description: '感应天地灵气，引气入体',
        requiredQi: 100,
        breakthroughRate: 0.95,
        cultivationSpeed: 1.5,
        requiredItems: [],
    }],
    [RealmType.FOUNDATION, {
        type: RealmType.FOUNDATION,
        name: '筑基',
        description: '筑就道基，灵气凝实',
        requiredQi: 500,
        breakthroughRate: 0.8,
        cultivationSpeed: 2.0,
        requiredItems: [{ itemId: 'pill_foundation', count: 1 }],
    }],
    [RealmType.GOLDEN_CORE, {
        type: RealmType.GOLDEN_CORE,
        name: '金丹',
        description: '凝聚金丹，脱胎换骨',
        requiredQi: 2000,
        breakthroughRate: 0.6,
        cultivationSpeed: 3.0,
        requiredItems: [{ itemId: 'pill_golden_core', count: 1 }],
    }],
    [RealmType.NASCENT_SOUL, {
        type: RealmType.NASCENT_SOUL,
        name: '元婴',
        description: '金丹化婴，神识大增',
        requiredQi: 8000,
        breakthroughRate: 0.4,
        cultivationSpeed: 5.0,
        requiredItems: [{ itemId: 'pill_nascent_soul', count: 1 }],
    }],
    [RealmType.SPIRIT_SEPARATION, {
        type: RealmType.SPIRIT_SEPARATION,
        name: '化神',
        description: '元婴出窍，化神通天',
        requiredQi: 30000,
        breakthroughRate: 0.3,
        cultivationSpeed: 8.0,
        requiredItems: [{ itemId: 'pill_spirit_separation', count: 1 }],
    }],
    [RealmType.MAHAYANA, {
        type: RealmType.MAHAYANA,
        name: '大乘',
        description: '大道将成，天人合一',
        requiredQi: 100000,
        breakthroughRate: 0.2,
        cultivationSpeed: 12.0,
        requiredItems: [{ itemId: 'pill_mahayana', count: 1 }],
    }],
    [RealmType.TRIBULATION, {
        type: RealmType.TRIBULATION,
        name: '渡劫',
        description: '天劫降临，九死一生',
        requiredQi: 500000,
        breakthroughRate: 0.1,
        cultivationSpeed: 20.0,
        requiredItems: [{ itemId: 'pill_tribulation', count: 1 }],
    }],
    [RealmType.IMMORTAL, {
        type: RealmType.IMMORTAL,
        name: '仙人',
        description: '渡劫飞升，成就仙道',
        requiredQi: 9999999,
        breakthroughRate: 0.05,
        cultivationSpeed: 50.0,
        requiredItems: [],
    }],
]);

/** 获取境界配置 */
export function getRealmConfig(realm: RealmType): RealmConfig {
    return RealmConfigs.get(realm)!;
}

/** 获取下一个境界 */
export function getNextRealm(realm: RealmType): RealmType | null {
    if (realm >= RealmType.IMMORTAL) return null;
    return realm + 1;
}
