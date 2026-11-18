// 시작 화면: 아무 키나 누르거나 클릭하면 Stage 01을 시작한다.
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2, '구구 대작전\n서울교대 새우깡 습격기', {
      fontSize: '28px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 80, '아무 키나 누르거나 클릭하면 시작', {
      fontSize: '18px',
      color: '#cccccc',
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown', this.startGame, this);
    this.input.once('pointerdown', this.startGame, this);
  }

  startGame() {
    this.scene.start('Stage01Scene');
  }
}
