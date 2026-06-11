/**
 * 单例基类
 * 非组件式的单例模式，适用于纯逻辑管理器
 */
export class Singleton<T> {
    private static _instances: Map<any, any> = new Map();

    public static getInstance<U>(this: new () => U): U {
        if (!Singleton._instances.has(this)) {
            Singleton._instances.set(this, new this());
        }
        return Singleton._instances.get(this) as U;
    }

    public static destroyInstance<U>(this: new () => U): void {
        Singleton._instances.delete(this);
    }
}
