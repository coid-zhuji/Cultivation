import { _decorator, Component, Node } from 'cc';
import { GameManager } from '../core/GameManager';
import { GameSceneType } from '../systems/SceneSystem';

const { ccclass, property } = _decorator;

/**
 * 宗门场景
 * 主基地，日常修炼和任务
 */
@ccclass('SectScene')
export class SectScene extends Component {

    @property(Node)
    public characterNode: Node | null = null;

    @property(Node)
    public cultivationEffectNode: Node | null = null;

    private _gameManager: GameManager | null = null;

    start() {
        this._gameManager = GameManager.instance;
        console.log('[SectScene] 宗门场景加载完成');
    }
}
