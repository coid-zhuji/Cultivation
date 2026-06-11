import { _decorator, Component, Label, Button, Color } from 'cc';
import { GameManager } from '../../core/GameManager';
import { TechniqueConfigs, getItemConfig, ItemType, ElementType } from '../../data/ItemConfig';

const { ccclass, property } = _decorator;

/**
 * 藏书阁面板
 * 学习功法
 */
@ccclass('LibraryPanel')
export class LibraryPanel extends Component {

    @property(Label)
    public techniqueListLabel: Label | null = null;

    @property(Label)
    public detailLabel: Label | null = null;

    @property(Label)
    public tipLabel: Label | null = null;

    private _gameManager: GameManager | null = null;

    start() {
        this._gameManager = GameManager.instance;
        this.refreshTechniqueList();
    }

    /** 刷新功法列表 */
    private refreshTechniqueList(): void {
        if (!this.techniqueListLabel) return;

        let text = '=== 可学功法 ===\n';
        TechniqueConfigs.forEach(config => {
            text += `[${config.name}] ${config.price}灵石\n`;
        });
        this.techniqueListLabel.string = text;
    }

    /** 学习功法 */
    public learnTechnique(techniqueId: string): void {
        if (!this._gameManager) return;

        const player = this._gameManager.playerManager;
        if (!player || !player.isInitialized) return;

        const config = getItemConfig(techniqueId);
        if (!config || config.type !== ItemType.TECHNIQUE) return;

        // 检查是否已学
        if (player.data.learnedTechniques.includes(techniqueId)) {
            this.showTip('已学习该功法', Color.YELLOW);
            return;
        }

        // 检查灵根适配
        if (config.element && player.data.attributes.spiritualRoot !== config.element) {
            this.showTip('灵根不适配，学习效率降低', Color.YELLOW);
        }

        // 购买
        const result = this._gameManager.resourceManager.buyItem(techniqueId);
        if (result.success) {
            player.data.learnedTechniques.push(techniqueId);
            player.data.currentTechnique = techniqueId;
            this.showTip(`学习${config.name}成功！`, Color.GREEN);
        } else {
            this.showTip(result.reason || '学习失败', Color.RED);
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
