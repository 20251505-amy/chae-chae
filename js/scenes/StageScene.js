import Gugu from '../objects/Gugu.js';

// 모든 스테이지가 함께 쓰는 탑다운 장면의 바탕.
// 새 스테이지는 이 클래스를 상속하고 key와 스테이지 정보만 넘기면 된다.
export default class StageScene extends Phaser.Scene {
  constructor(key, stage) {
    super(key);
    this.stage = stage; // { number: '01', name: '정문 & 향학로' }
  }

  create() {
    this.add.text(20, 20, `Stage ${this.stage.number}  ${this.stage.name}`, {
      fontSize: '24px',
      color: '#ffffff',
    });

    this.gugu = new Gugu(this, this.scale.width / 2, this.scale.height / 2);
  }

  update() {
    this.gugu.update();
  }
}
