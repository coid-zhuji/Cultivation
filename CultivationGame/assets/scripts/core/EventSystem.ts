import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

/**
 * 全局事件系统 - 观察者模式
 * 用于各系统间解耦通信
 */
@ccclass('EventSystem')
export class EventSystem extends Component {

    private _listeners: Map<string, Set<Function>> = new Map();

    /** 注册事件监听 */
    public on(eventName: string, callback: Function): void {
        if (!this._listeners.has(eventName)) {
            this._listeners.set(eventName, new Set());
        }
        this._listeners.get(eventName)!.add(callback);
    }

    /** 注册一次性事件监听 */
    public once(eventName: string, callback: Function): void {
        const wrapper = (...args: any[]) => {
            callback(...args);
            this.off(eventName, wrapper);
        };
        this.on(eventName, wrapper);
    }

    /** 取消事件监听 */
    public off(eventName: string, callback: Function): void {
        const listeners = this._listeners.get(eventName);
        if (listeners) {
            listeners.delete(callback);
        }
    }

    /** 发射事件 */
    public emit(eventName: string, ...args: any[]): void {
        const listeners = this._listeners.get(eventName);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`[EventSystem] 事件 ${eventName} 处理异常:`, error);
                }
            });
        }
    }

    /** 移除指定事件的所有监听 */
    public offAll(eventName: string): void {
        this._listeners.delete(eventName);
    }

    /** 清除所有监听 */
    public clear(): void {
        this._listeners.clear();
    }

    protected onDestroy(): void {
        this.clear();
    }
}
