/**
 * 微信小游戏平台适配层
 * 在游戏入口处引入，适配微信小游戏API
 */

declare global {
    const wx: any;
}

/** 是否在微信小游戏环境 */
export const isWechatPlatform = typeof wx !== 'undefined' && typeof wx.getSystemInfoSync === 'function';

/** 获取系统信息 */
export function getSystemInfo(): any {
    if (isWechatPlatform) {
        return wx.getSystemInfoSync();
    }
    return {
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
        platform: 'web',
    };
}

/** 显示提示 */
export function showToast(title: string, icon: string = 'none', duration: number = 1500): void {
    if (isWechatPlatform) {
        wx.showToast({ title, icon, duration });
    } else {
        console.log(`[Toast] ${title}`);
    }
}

/** 显示模态框 */
export function showModal(options: {
    title: string;
    content: string;
    showCancel?: boolean;
    confirmText?: string;
    cancelText?: string;
}): Promise<boolean> {
    return new Promise((resolve) => {
        if (isWechatPlatform) {
            wx.showModal({
                ...options,
                success: (res: any) => resolve(res.confirm),
                fail: () => resolve(false),
            });
        } else {
            const result = confirm(`${options.title}\n${options.content}`);
            resolve(result);
        }
    });
}

/** 震动 */
export function vibrateShort(): void {
    if (isWechatPlatform) {
        wx.vibrateShort({ type: 'light' });
    }
}

/** 分享 */
export function shareAppMessage(options: {
    title: string;
    imageUrl?: string;
    query?: string;
}): void {
    if (isWechatPlatform) {
        wx.shareAppMessage(options);
    }
}

/** 设置分享菜单 */
export function showShareMenu(): void {
    if (isWechatPlatform) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline'],
        });
    }
}

/** 创建激励视频广告（可选） */
export function createRewardedVideoAd(adUnitId: string): any {
    if (isWechatPlatform) {
        return wx.createRewardedVideoAd({ adUnitId });
    }
    return null;
}
