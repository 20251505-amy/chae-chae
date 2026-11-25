// 다음 스테이지로 가는 출입문. 처음에는 잠겨 있고, open()을 부르면 열린다.
// design.md에 따라 잠김은 회색, 열림은 노랑 문짝으로 그린다 (문틀 · 손잡이 그림은 props.js).
// 충돌 판정은 보이지 않는 사각형(sprite)이 맡는다.
import { drawDoor } from './props.js';

export default class Door {
  constructor(scene, x, y, width, height) {
    this.isOpen = false;
    this.width = width;
    this.height = height;
    this.sprite = scene.add.rectangle(x, y, width, height).setVisible(false);
    scene.physics.add.existing(this.sprite, true);
    this.graphic = scene.add.graphics({ x, y }).setDepth(-1);
    drawDoor(this.graphic, width, height, false);
  }

  open() {
    this.isOpen = true;
    drawDoor(this.graphic, this.width, this.height, true);
  }
}
