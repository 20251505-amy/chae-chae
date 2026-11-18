// 다음 스테이지로 가는 출입문. 처음에는 잠겨 있고, open()을 부르면 열린다.
// 그래픽 스타일이 [미정]이라 지금은 사각형으로 그린다. (잠김: 갈색, 열림: 초록색)
const LOCKED_COLOR = 0x8b5a2b;
const OPEN_COLOR = 0x4caf50;

export default class Door {
  constructor(scene, x, y, width, height) {
    this.isOpen = false;
    this.sprite = scene.add.rectangle(x, y, width, height, LOCKED_COLOR).setDepth(-1);
    scene.physics.add.existing(this.sprite, true);
  }

  open() {
    this.isOpen = true;
    this.sprite.setFillStyle(OPEN_COLOR);
  }
}
