import { TEXT } from '../ui/style.js';
import { createButton } from '../ui/button.js';
import { notebook } from '../systems/notebook.js';
import { inventory } from '../systems/inventory.js';
import DialogBox from '../ui/DialogBox.js';
import { ENDING } from '../data/story.js';

// 엔딩 화면: 먼저 엔딩 대사가 나오고, 끝나면 탈출 성공 문구와 "처음으로" 버튼.
// 버튼이나 Enter를 누르면 수첩 · 아이템을 비우고 시작 화면으로 간다.
export default class EndingScene extends Phaser.Scene {
  constructor() {
    super('EndingScene');
  }

  create() {
    new DialogBox(this).open(ENDING, () => this.showResult());
  }

  showResult() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2 - 70, '탈출 성공!', TEXT.large).setOrigin(0.5);
    this.add.text(width / 2, height / 2, '구구는 전설의 새우깡 1개를 맛보았다', TEXT.normal).setOrigin(0.5);
    createButton(this, width / 2, height / 2 + 80, '처음으로 (Enter)', () => this.restart());

    this.input.keyboard.once('keydown-ENTER', () => this.restart());
  }

  restart() {
    notebook.reset();
    inventory.reset();
    this.scene.start('TitleScene');
  }
}
