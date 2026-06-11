import { _decorator, Component, Node, Button, Label, Color } from 'cc';
import { GameManager } from '../core/GameManager';
import { GameSceneType, SceneConfigs } from '../systems/SceneSystem';

const { ccclass, property } = _decorator;

/**
 * 底部导航栏
 * 切换不同场景/功能页面
 */
@ccclass('BottomNav')
export class BottomNav extends Component {

    @property(Node)
    public navContainer: Node | null = null;

    private _gameManager: GameManager | null = null;
    private _currentNav: GameSceneType = GameSceneType.SECT;
    private _navButtons: Map<GameSceneType, Node> = new Map();

    /** 导航项配置 */
    private readonly NAV_ITEMS: { type: GameSceneType; label: string; icon: string }[] = [
        { type: GameSceneType.SECT, label: '宗门', icon: 'sect' },
        { type: GameSceneType.LIBRARY, label: '藏书阁', icon: 'library' },
        { type: GameSceneType.ALCHEMY, label: '炼丹房', icon: 'alchemy' },
        { type: GameSceneType.FORGE, label: '炼器阁', icon: 'forge' },
        { type: GameSceneType.SECRET_REALM, label: '秘境', icon: 'secret' },
    ];

    start() {
        this._gameManager = GameManager.instance;
        this.createNavButtons();
    }

    /** 创建导航按钮 */
    private createNavButtons(): void {
        if (!this.navContainer) return;

        this.NAV_ITEMS.forEach(item => {
            const config = SceneConfigs.get(item.type);
            if (!config) return;

            // 创建按钮节点（实际项目中应使用预制体）
            const btnNode = new Node(item.label);
            btnNode.addComponent(UITransform).setContentSize(60, 50);

            const label = btnNode.addComponent(Label);
            label.string = item.label;
            label.fontSize = 14;
            label.color = item.type === this._currentNav ? Color.YELLOW : Color.WHITE;

            const button = btnNode.addComponent(Button);
            button.node.on(Button.EventType.CLICK, () => {
                this.onNavClick(item.type);
            }, this);

            btnNode.parent = this.navContainer!;
            this._navButtons.set(item.type, btnNode);
        });
    }

    /** 导航点击 */
    private onNavClick(sceneType: GameSceneType): void {
        if (sceneType === this._currentNav) return;

        if (this._gameManager) {
            const success = this._gameManager.sceneSystem.switchScene(sceneType);
            if (success) {
                this._currentNav = sceneType;
                this.updateNavStyle();
            }
        }
    }

    /** 更新导航样式 */
    private updateNavStyle(): void {
        this._navButtons.forEach((node, type) => {
            const label = node.getComponent(Label);
            if (label) {
                label.color = type === this._currentNav ? Color.YELLOW : Color.WHITE;
            }
        });
    }
}
