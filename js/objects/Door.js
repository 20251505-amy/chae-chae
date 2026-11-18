// 다음 스테이지로 가는 출입문. 처음에는 잠겨 있고, open()을 부르면 열린다.
// design.md에 따라 잠김은 회색, 열림은 노랑, 진남색 외곽선으로 그린다.
import { COLORS, OUTLINE } from '../ui/style.js';

export default class Door {
  constructor(scene, x, y, width, height) {
    this.isOpen = false;
    this.sprite = scene.add.rectangle(x, y, width, height, COLORS.gray)
      .setStrokeStyle(OUTLINE, COLORS.navy).setDepth(-1);
    scene.physics.add.existing(this.sprite, true);
  }

  open() {
    this.isOpen = true;
    this.sprite.setFillStyle(COLORS.yellow);
  }
}
