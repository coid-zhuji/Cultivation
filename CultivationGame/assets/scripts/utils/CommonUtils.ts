/**
 * 常用工具函数
 */

/** 格式化数字（带单位） */
export function formatNumber(num: number): string {
    if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
    if (num >= 10000) return (num / 10000).toFixed(1) + '万';
    if (num >= 1000) return (num / 1000).toFixed(1) + '千';
    return Math.floor(num).toString();
}

/** 格式化时间（秒 → 时分秒） */
export function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}时${m}分${s}秒`;
    if (m > 0) return `${m}分${s}秒`;
    return `${s}秒`;
}

/** 随机整数 [min, max] */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 随机浮点数 [min, max) */
export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/** 概率判定 */
export function rollChance(rate: number): boolean {
    return Math.random() < rate;
}

/** 加权随机选择 */
export function weightedRandom<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
        random -= weights[i];
        if (random <= 0) return items[i];
    }

    return items[items.length - 1];
}

/** 限值 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/** 深拷贝 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
