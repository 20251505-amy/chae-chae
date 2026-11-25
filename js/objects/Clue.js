// 바닥에 놓인 단서. design.md에 따라 노란 종이 조각(신문 조각 모양)에 진남색 외곽선으로 그린다.
// 충돌 판정은 보이지 않는 사각형(sprite)이 맡는다.
import { drawPaperScrap } from './props.js';

export default class Clue {
  // clue: { id, name }
  constructor(scene, x, y, clue) {
    this.clue = clue;
    this.sprite = scene.add.rectangle(x, y, 26, 22).setVisible(false);
    scene.physics.add.existing(this.sprite, true);
    this.graphic = drawPaperScrap(scene, x, y);
  }

  destroy() {
    this.sprite.destroy();
    this.graphic.destroy();
  }
}
