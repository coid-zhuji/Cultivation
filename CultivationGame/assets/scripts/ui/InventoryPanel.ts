import { _decorator, Component, Node, Label, ScrollView, Prefab, instantiate } from 'cc';
import { GameManager } from '../core/GameManager';
import { getItemConfig, ItemConfig, ItemType, ItemRarity } from '../data/ItemConfig';

const { ccclass, property } = _decorator;

/** 背包物品槽UI */
export interface ItemSlotData {
    itemId: string;
    count: number;
    config: ItemConfig;
}

/**
 * 背包面板
 * 显示和管理玩家物品
 */
@ccclass('InventoryPanel')
export class InventoryPanel extends Component {

    @property(Node)
    public gridContainer: Node | null = null;

    @property(Label)
    public detailLabel: Label | null = null;

    @property(Prefab)
    public itemSlotPrefab: Prefab | null = null;

    /** 当前筛选类型 */
    private _filterType: ItemType | null = null;

    private _gameManager: GameManager | null = null;

    start() {
        this._gameManager = GameManager.instance;
        this.refresh();
    }

    /** 刷新背包显示 */
    public refresh(): void {
        if (!this._gameManager || !this.gridContainer) return;

        const player = this._gameManager.playerManager;
        if (!player || !player.isInitialized) return;

        // 清空当前显示
        this.gridContainer.removeAllChildren();

        // 遍历背包物品
        const inventory = player.data.inventory;
        inventory.forEach(item => {
            const config = getItemConfig(item.itemId);
            if (!config) return;

            // 筛选
            if (this._filterType && config.type !== this._filterType) return;

            this.createItemSlot(item.itemId, item.count, config);
        });
    }

    /** 创建物品槽 */
    private createItemSlot(itemId: string, count: number, config: ItemConfig): void {
        if (!this.gridContainer) return;

        let slotNode: Node;

        if (this.itemSlotPrefab) {
            slotNode = instantiate(this.itemSlotPrefab);
        } else {
            slotNode = new Node(config.name);
            slotNode.addComponent(UITransform).setContentSize(50, 50);

            const label = slotNode.addComponent(Label);
            label.string = `${config.name}x${count}`;
            label.fontSize = 12;
        }

        slotNode.parent = this.gridContainer;
    }

    /** 设置筛选类型 */
    public setFilter(type: ItemType | null): void {
        this._filterType = type;
        this.refresh();
    }

    /** 显示物品详情 */
    public showItemDetail(itemId: string): void {
        const config = getItemConfig(itemId);
        if (!config || !this.detailLabel) return;

        const rarityNames: Record<string, string> = {
            [ItemRarity.COMMON]: '普通',
            [ItemRarity.UNCOMMON]: '优秀',
            [ItemRarity.RARE]: '稀有',
            [ItemRarity.EPIC]: '史诗',
            [ItemRarity.LEGENDARY]: '传说',
        };

        this.detailLabel.string =
            `【${config.name}】\n` +
            `品质: ${rarityNames[config.rarity] || '未知'}\n` +
            `${config.description}\n` +
            `售价: ${config.price}灵石`;
    }
}
