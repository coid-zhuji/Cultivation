import { _decorator, Component, sys } from 'cc';
import { PlayerData } from '../data/PlayerData';

const { ccclass } = _decorator;

const SAVE_KEY = 'cultivation_save_data';
const AUTO_SAVE_INTERVAL = 60; // 自动保存间隔（秒）

/**
 * 存储管理器
 * 适配微信小游戏和Web平台的存储API
 */
@ccclass('StorageManager')
export class StorageManager extends Component {

    private _saveData: any = null;
    private _autoSaveTimer: number = 0;

    /** 初始化存储系统 */
    public init(): void {
        this._saveData = {};
        console.log('[StorageManager] 存储系统初始化完成');
    }

    /** 是否在微信小游戏环境 */
    private get isWechat(): boolean {
        return typeof wx !== 'undefined';
    }

    /** 存储数据 */
    public setItem(key: string, value: any): void {
        try {
            const data = JSON.stringify(value);
            if (this.isWechat) {
                wx.setStorageSync(key, data);
            } else {
                sys.localStorage.setItem(key, data);
            }
        } catch (error) {
            console.error(`[StorageManager] 存储失败 key=${key}:`, error);
        }
    }

    /** 读取数据 */
    public getItem<T>(key: string, defaultValue: T | null = null): T | null {
        try {
            let data: string | null = null;
            if (this.isWechat) {
                data = wx.getStorageSync(key) as string || null;
            } else {
                data = sys.localStorage.getItem(key);
            }
            if (data) {
                return JSON.parse(data) as T;
            }
        } catch (error) {
            console.error(`[StorageManager] 读取失败 key=${key}:`, error);
        }
        return defaultValue;
    }

    /** 删除数据 */
    public removeItem(key: string): void {
        try {
            if (this.isWechat) {
                wx.removeStorageSync(key);
            } else {
                sys.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`[StorageManager] 删除失败 key=${key}:`, error);
        }
    }

    /** 保存游戏数据 */
    public saveGameData(): void {
        const gameData = this.collectGameData();
        this.setItem(SAVE_KEY, gameData);
        console.log('[StorageManager] 游戏数据已保存');
    }

    /** 加载游戏数据 */
    public loadGameData(): PlayerData | null {
        const data = this.getItem<PlayerData>(SAVE_KEY);
        if (data) {
            this._saveData = data;
            console.log('[StorageManager] 存档加载成功');
            return data;
        }
        console.log('[StorageManager] 无存档，创建新游戏');
        return null;
    }

    /** 收集当前游戏数据 */
    private collectGameData(): any {
        // 由各系统自行提供数据
        return {
            version: '1.0.0',
            timestamp: Date.now(),
            player: this._saveData?.player || null,
            resources: this._saveData?.resources || null,
            cultivation: this._saveData?.cultivation || null,
        };
    }

    /** 更新自动保存计时器 */
    public update(dt: number): void {
        this._autoSaveTimer += dt;
        if (this._autoSaveTimer >= AUTO_SAVE_INTERVAL) {
            this._autoSaveTimer = 0;
            this.saveGameData();
        }
    }

    /** 清除存档 */
    public clearSave(): void {
        this.removeItem(SAVE_KEY);
        this._saveData = {};
        console.log('[StorageManager] 存档已清除');
    }
}
