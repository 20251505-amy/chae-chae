// 바닥에 놓인 단서. design.md에 따라 노란 종이 조각에 진남색 외곽선으로 그린다.
import { COLORS, OUTLINE } from '../ui/style.js';

export default class Clue {
  // clue: { id, name }
  constructor(scene, x, y, clue) {
    this.clue = clue;
    this.sprite = scene.add.rectangle(x, y, 22, 16, COLORS.yellow)
      .setStrokeStyle(OUTLINE, COLORS.navy).setDepth(-1);
    scene.physics.add.existing(this.sprite, true);
  }

  destroy() {
    this.sprite.destroy();
  }
}
