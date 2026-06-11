import { _decorator, Component, Node, director, game } from 'cc';
import { EventSystem } from './EventSystem';
import { StorageManager } from './StorageManager';
import { PlayerManager } from '../systems/PlayerManager';
import { CultivationSystem } from '../systems/CultivationSystem';
import { ResourceManager } from '../systems/ResourceManager';
import { SceneSystem } from '../systems/SceneSystem';

const { ccclass, property } = _decorator;

/**
 * 游戏主管理器 - 单例模式
 * 负责游戏生命周期管理和各系统协调
 */
@ccclass('GameManager')
export class GameManager extends Component {

    private static _instance: GameManager | null = null;

    // 系统引用
    private _eventSystem: EventSystem | null = null;
    private _storageManager: StorageManager | null = null;
    private _playerManager: PlayerManager | null = null;
    private _cultivationSystem: CultivationSystem | null = null;
    private _resourceManager: ResourceManager | null = null;
    private _sceneSystem: SceneSystem | null = null;

    // 游戏状态
    private _isPaused: boolean = false;
    private _gameTime: number = 0; // 游戏内时间（秒）
    private _timeScale: number = 1; // 时间倍率

    public static get instance(): GameManager {
        return GameManager._instance!;
    }

    public get eventSystem(): EventSystem {
        return this._eventSystem!;
    }

    public get storageManager(): StorageManager {
        return this._storageManager!;
    }

    public get playerManager(): PlayerManager {
        return this._playerManager!;
    }

    public get cultivationSystem(): CultivationSystem {
        return this._cultivationSystem!;
    }

    public get resourceManager(): ResourceManager {
        return this._resourceManager!;
    }

    public get sceneSystem(): SceneSystem {
        return this._sceneSystem!;
    }

    public get isPaused(): boolean {
        return this._isPaused;
    }

    public get gameTime(): number {
        return this._gameTime;
    }

    public get timeScale(): number {
        return this._timeScale;
    }

    public set timeScale(value: number) {
        this._timeScale = Math.max(1, Math.min(value, 10));
    }

    onLoad() {
        if (GameManager._instance && GameManager._instance !== this) {
            this.destroy();
            return;
        }
        GameManager._instance = this;
        director.addPersistRootNode(this.node);

        this.initSystems();
    }

    /** 初始化所有子系统 */
    private initSystems(): void {
        // 创建系统节点
        this._eventSystem = this.addComponent(EventSystem);
        this._storageManager = this.addComponent(StorageManager);
        this._playerManager = this.addComponent(PlayerManager);
        this._cultivationSystem = this.addComponent(CultivationSystem);
        this._resourceManager = this.addComponent(ResourceManager);
        this._sceneSystem = this.addComponent(SceneSystem);

        // 初始化存储
        this._storageManager.init();

        // 加载存档或创建新游戏
        this._storageManager.loadGameData();

        console.log('[GameManager] 所有系统初始化完成');
    }

    start() {
        // 启动游戏主循环
        this.startGameLoop();
    }

    /** 启动游戏主循环 */
    private startGameLoop(): void {
        // 每秒执行一次游戏逻辑
        this.schedule(() => {
            if (!this._isPaused) {
                this.onGameTick();
            }
        }, 1);
    }

    /** 游戏逻辑帧（每秒） */
    private onGameTick(): void {
        this._gameTime += this._timeScale;

        // 修炼系统更新
        this._cultivationSystem?.onTick(this._timeScale);

        // 资源系统更新
        this._resourceManager?.onTick(this._timeScale);

        // 发送游戏帧事件
        this._eventSystem?.emit('game-tick', this._gameTime);
    }

    /** 暂停游戏 */
    public pauseGame(): void {
        this._isPaused = true;
        this._eventSystem?.emit('game-pause');
    }

    /** 恢复游戏 */
    public resumeGame(): void {
        this._isPaused = false;
        this._eventSystem?.emit('game-resume');
    }

    /** 保存游戏 */
    public saveGame(): void {
        this._storageManager?.saveGameData();
        this._eventSystem?.emit('game-saved');
    }

    /** 自动保存（每60秒） */
    protected onDestroy(): void {
        this._storageManager?.saveGameData();
        if (GameManager._instance === this) {
            GameManager._instance = null;
        }
    }
}
