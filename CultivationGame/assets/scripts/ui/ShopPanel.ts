import { _decorator, Component, Node, Label, Button, Color } from 'cc';
import { GameManager } from '../core/GameManager';
import { GameSceneType, SceneConfigs } from '../systems/SceneSystem';
import { getItemConfig, PillConfigs, TechniqueConfigs, EquipmentConfigs, ItemType } from '../data/ItemConfig';

const { ccclass, property } = _decorator;

/**
 * 商店面板
 * 购买丹药、功法、装备
 */
@ccclass('ShopPanel')
export class ShopPanel extends Component {

    @property(Node)
    public itemListContainer: Node | null = null;

    @property(Label)
    public spiritStoneLabel: Label | null = null;

    @property(Label)
    public tipLabel: Label | null = null;

    /** 当前显示的物品类型 */
    private _currentTab: ItemType = ItemType.PILL;

    private _gameManager: GameManager | null = null;

    start() {
        this._gameManager = GameManager.instance;
        this.showTab(ItemType.PILL);
    }

    /** 切换商店标签 */
    public showTab(type: ItemType): void {
        this._currentTab = type;
        this.refreshItemList();
    }

    /** 刷新物品列表 */
    private refreshItemList(): void {
        if (!this.itemListContainer) return;

        this.itemListContainer.removeAllChildren();

        let items;
        switch (this._currentTab) {
            case ItemType.PILL:
                items = PillConfigs;
                break;
            case ItemType.TECHNIQUE:
                items = TechniqueConfigs;
                break;
            case ItemType.EQUIPMENT:
                items = EquipmentConfigs;
                break;
            default:
                return;
        }

        items.forEach(config => {
            const itemNode = new Node(config.name);
            itemNode.addComponent(UITransform).setContentSize(280, 40);

            const label = itemNode.addComponent(Label);
            label.string = `${config.name} - ${config.price}灵石`;
            label.fontSize = 14;

            const buyBtn = itemNode.addComponent(Button);
            buyBtn.node.on(Button.EventType.CLICK, () => {
                this.buyItem(config.id);
            }, this);

            itemNode.parent = this.itemListContainer!;
        });
    }

    /** 购买物品 */
    private buyItem(itemId: string): void {
        if (!this._gameManager) return;

        const result = this._gameManager.resourceManager.buyItem(itemId);
        if (result.success) {
            this.showTip(`购买${result.itemName}成功！`, Color.GREEN);
        } else {
            this.showTip(result.reason || '购买失败', Color.RED);
        }

        this.updateSpiritStoneDisplay();
    }

    /** 更新灵石显示 */
    private updateSpiritStoneDisplay(): void {
        if (!this._gameManager || !this.spiritStoneLabel) return;
        const player = this._gameManager.playerManager;
        if (player && player.isInitialized) {
            this.spiritStoneLabel.string = `灵石: ${Math.floor(player.data.spiritStones)}`;
        }
    }

    /** 显示提示 */
    private showTip(text: string, color: Color): void {
        if (this.tipLabel) {
            this.tipLabel.string = text;
            this.tipLabel.color = color;
        }
    }
}
