// 임시 화면: Phaser가 정상적으로 실행되는지 확인하는 용도.
// 시작 화면의 실제 구성은 spec.md에서 [미정]이다.
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    this.titleText = this.add.text(0, 0, '구구 대작전\n서울교대 새우깡 습격기', {
      fontSize: '28px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    this.placeText();
    this.scale.on('resize', this.placeText, this);
  }

  placeText() {
    this.titleText.setPosition(this.scale.width / 2, this.scale.height / 2);
  }
}
