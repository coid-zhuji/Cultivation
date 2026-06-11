import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

/** 场景类型 */
export enum GameSceneType {
    SECT = 'sect',           // 宗门
    SECRET_REALM = 'secret', // 秘境
    AUCTION = 'auction',     // 拍卖行
    FORGE = 'forge',         // 炼器阁
    ALCHEMY = 'alchemy',     // 炼丹房
    LIBRARY = 'library',     // 藏书阁
}

/** 场景配置 */
export interface SceneConfig {
    type: GameSceneType;
    name: string;
    description: string;
    /** 进入所需最低境界 */
    minRealm: number;
    /** 场景Cocos场景路径 */
    scenePath: string;
}

/** 场景配置表 */
export const SceneConfigs: Map<GameSceneType, SceneConfig> = new Map([
    [GameSceneType.SECT, {
        type: GameSceneType.SECT,
        name: '宗门',
        description: '修仙者的家园，可进行日常修炼',
        minRealm: 0,
        scenePath: 'scenes/SectScene',
    }],
    [GameSceneType.SECRET_REALM, {
        type: GameSceneType.SECRET_REALM,
        name: '秘境',
        description: '危险的秘境，蕴含珍稀资源',
        minRealm: 1,
        scenePath: 'scenes/SecretRealmScene',
    }],
    [GameSceneType.AUCTION, {
        type: GameSceneType.AUCTION,
        name: '拍卖行',
        description: '交易各种修仙资源',
        minRealm: 0,
        scenePath: 'scenes/AuctionScene',
    }],
    [GameSceneType.FORGE, {
        type: GameSceneType.FORGE,
        name: '炼器阁',
        description: '打造和强化法宝装备',
        minRealm: 2,
        scenePath: 'scenes/ForgeScene',
    }],
    [GameSceneType.ALCHEMY, {
        type: GameSceneType.ALCHEMY,
        name: '炼丹房',
        description: '炼制各种丹药',
        minRealm: 1,
        scenePath: 'scenes/AlchemyScene',
    }],
    [GameSceneType.LIBRARY, {
        type: GameSceneType.LIBRARY,
        name: '藏书阁',
        description: '学习各种功法秘籍',
        minRealm: 0,
        scenePath: 'scenes/LibraryScene',
    }],
]);

/**
 * 场景系统
 * 管理场景切换和场景状态
 */
@ccclass('SceneSystem')
export class SceneSystem extends Component {

    private _currentScene: GameSceneType = GameSceneType.SECT;

    public get currentScene(): GameSceneType {
        return this._currentScene;
    }

    /** 切换场景 */
    public switchScene(sceneType: GameSceneType): boolean {
        const config = SceneConfigs.get(sceneType);
        if (!config) {
            console.error(`[SceneSystem] 场景配置不存在: ${sceneType}`);
            return false;
        }

        const gameManager = this.getComponent('GameManager') as any;
        if (!gameManager) return false;

        const playerManager = gameManager.playerManager;
        if (!playerManager) return false;

        // 检查境界限制
        if (playerManager.data.realm < config.minRealm) {
            console.log(`[SceneSystem] 境界不足，需要: ${config.minRealm}`);
            return false;
        }

        const prevScene = this._currentScene;
        this._currentScene = sceneType;

        // 发送场景切换事件
        gameManager.eventSystem.emit('scene-changed', {
            from: prevScene,
            to: sceneType,
            config: config,
        });

        console.log(`[SceneSystem] 切换场景: ${config.name}`);
        return true;
    }

    /** 获取当前场景配置 */
    public getCurrentConfig(): SceneConfig {
        return SceneConfigs.get(this._currentScene)!;
    }

    /** 检查场景是否可进入 */
    public canEnter(sceneType: GameSceneType): boolean {
        const config = SceneConfigs.get(sceneType);
        if (!config) return false;

        const gameManager = this.getComponent('GameManager') as any;
        if (!gameManager) return false;

        const playerManager = gameManager.playerManager;
        if (!playerManager) return false;

        return playerManager.data.realm >= config.minRealm;
    }
}
