import { _decorator, Component, Node, Label, Button, EditBox, Color, UITransform } from 'cc';
import { GameManager } from '../core/GameManager';
import { ElementType, RealmType } from '../data/PlayerData';

const { ccclass, property } = _decorator;

/** 灵根选择项 */
const ELEMENT_OPTIONS: { type: ElementType; name: string; color: string }[] = [
    { type: ElementType.METAL, name: '金', color: '#FFD700' },
    { type: ElementType.WOOD, name: '木', color: '#228B22' },
    { type: ElementType.WATER, name: '水', color: '#4169E1' },
    { type: ElementType.FIRE, name: '火', color: '#FF4500' },
    { type: ElementType.EARTH, name: '土', color: '#8B4513' },
];

/**
 * 角色创建面板
 * 新游戏时选择角色名和灵根
 */
@ccclass('CharacterCreatePanel')
export class CharacterCreatePanel extends Component {

    @property(EditBox)
    public nameInput: EditBox | null = null;

    @property(Node)
    public elementContainer: Node | null = null;

    @property(Label)
    public selectedElementLabel: Label | null = null;

    @property(Button)
    public confirmBtn: Button | null = null;

    @property(Label)
    public tipLabel: Label | null = null;

    private _selectedElement: ElementType = ElementType.FIRE;
    private _gameManager: GameManager | null = null;

    start() {
        this._gameManager = GameManager.instance;
        this.createElementButtons();

        if (this.confirmBtn) {
            this.confirmBtn.node.on(Button.EventType.CLICK, this.onConfirm, this);
        }
    }

    /** 创建灵根选择按钮 */
    private createElementButtons(): void {
        if (!this.elementContainer) return;

        ELEMENT_OPTIONS.forEach(opt => {
            const btnNode = new Node(`element_${opt.name}`);
            btnNode.addComponent(UITransform).setContentSize(50, 40);

            const label = btnNode.addComponent(Label);
            label.string = opt.name;
            label.fontSize = 20;

            const button = btnNode.addComponent(Button);
            button.node.on(Button.EventType.CLICK, () => {
                this._selectedElement = opt.type;
                if (this.selectedElementLabel) {
                    this.selectedElementLabel.string = `灵根: ${opt.name}`;
                }
            }, this);

            btnNode.parent = this.elementContainer!;
        });
    }

    /** 确认创建角色 */
    private onConfirm(): void {
        if (!this._gameManager) return;

        const name = this.nameInput?.string?.trim();
        if (!name || name.length === 0) {
            this.showTip('请输入角色名', Color.RED);
            return;
        }

        if (name.length > 8) {
            this.showTip('角色名不能超过8个字符', Color.RED);
            return;
        }

        // 创建角色
        this._gameManager.playerManager.createPlayer(name, this._selectedElement);

        // 保存
        this._gameManager.saveGame();

        this.showTip('角色创建成功！', Color.GREEN);

        // 通知进入游戏
        this._gameManager.eventSystem.emit('character-created');

        // 隐藏创建面板
        this.node.active = false;
    }

    /** 显示提示 */
    private showTip(text: string, color: Color): void {
        if (this.tipLabel) {
            this.tipLabel.string = text;
            this.tipLabel.color = color;
        }
    }
}
