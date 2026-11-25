import { COLORS, CSS_COLORS, OUTLINE, TEXT } from './style.js';

// 화면 아래 가운데의 대사창 (design.md). 크림색 창에 진남색 외곽선, 말하는 사람 이름은 노란 이름표.
// Enter나 클릭으로 다음 줄로 넘기고, 마지막 줄을 넘기면 닫히며 onDone을 부른다.
// 스테이지에서 열려 있는 동안에는 게임이 멈춘다 (StageScene).
const BOX_WIDTH = 1000;
const BOX_HEIGHT = 150;
const PADDING = 24;
const CORNER = 12;

export default class DialogBox {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;

    const { width, height } = scene.scale;
    const top = height - BOX_HEIGHT - 30;
    this.container = scene.add.container(width / 2, top).setDepth(140).setVisible(false);

    const box = scene.add.graphics();
    box.fillStyle(COLORS.cream);
    box.fillRoundedRect(-BOX_WIDTH / 2, 0, BOX_WIDTH, BOX_HEIGHT, CORNER);
    box.lineStyle(OUTLINE, COLORS.navy);
    box.strokeRoundedRect(-BOX_WIDTH / 2, 0, BOX_WIDTH, BOX_HEIGHT, CORNER);

    this.nameTag = scene.add.text(-BOX_WIDTH / 2 + PADDING, 0, '', {
      ...TEXT.normal,
      backgroundColor: CSS_COLORS.yellow,
      padding: { x: 10, y: 2 },
    }).setOrigin(0, 0.5);
    this.text = scene.add.text(-BOX_WIDTH / 2 + PADDING, 30, '', {
      ...TEXT.normal,
      wordWrap: { width: BOX_WIDTH - PADDING * 2 },
      lineSpacing: 6,
    });
    const hint = scene.add.text(BOX_WIDTH / 2 - PADDING, BOX_HEIGHT - 14, 'Enter ▶', TEXT.small)
      .setOrigin(1, 1);
    this.container.add([box, this.nameTag, this.text, hint]);

    scene.input.keyboard.on('keydown-ENTER', () => this.next());
    scene.input.on('pointerdown', () => this.next());
  }

  // lines: [{ speaker, text }]
  open(lines, onDone = null) {
    this.lines = lines;
    this.index = 0;
    this.onDone = onDone;
    this.isOpen = true;
    this.container.setVisible(true);
    this.render();
  }

  close() {
    this.isOpen = false;
    this.justClosed = true; // 닫을 때 누른 Enter가 구구의 쪼기로 이어지지 않게 한다.
    this.container.setVisible(false);
  }

  next() {
    if (!this.isOpen) return;
    this.index += 1;
    if (this.index < this.lines.length) {
      this.render();
      return;
    }
    this.close();
    this.onDone?.();
  }

  render() {
    const { speaker, text } = this.lines[this.index];
    this.nameTag.setText(speaker);
    this.text.setText(text);
  }
}
