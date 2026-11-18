// 바닥에 놓인 단서. 그래픽 스타일이 [미정]이라 지금은 작은 종이색 사각형으로 그린다.
const COLOR = 0xe8e0c8;

export default class Clue {
  // clue: { id, name }
  constructor(scene, x, y, clue) {
    this.clue = clue;
    this.sprite = scene.add.rectangle(x, y, 22, 16, COLOR).setDepth(-1);
    scene.physics.add.existing(this.sprite, true);
  }

  destroy() {
    this.sprite.destroy();
  }
}
