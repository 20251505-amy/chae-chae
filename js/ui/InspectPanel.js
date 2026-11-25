import { COLORS, OUTLINE, TEXT } from './style.js';

// 자세히 보기 창 (design.md: 가운데). 단서를 찾거나 물건을 쪼아 살펴볼 때 연다.
// 위에는 사람이 쓴 글이 그대로, 아래에는 구구의 한마디가 나온다.
// Enter를 누르면 닫히고 onClose를 부른다. 열려 있는 동안에는 게임이 멈춘다 (StageScene).
const BOX_WIDTH = 700;
const BOX_HEIGHT = 520;
const PADDING = 28;

export default class InspectPanel {
  constructor(scene) {
    this.isOpen = false;

    const { width, height } = scene.scale;
    this.container = scene.add.container(width / 2, height / 2).setDepth(120).setVisible(false);
    // 창 뒤를 진남색 35%로 어둡게 한다.
    this.container.add(scene.add.rectangle(0, 0, width, height, COLORS.navy, 0.35));
    this.container.add(scene.add.rectangle(0, 0, BOX_WIDTH, BOX_HEIGHT, COLORS.cream)
      .setStrokeStyle(OUTLINE, COLORS.navy));

    const left = -BOX_WIDTH / 2 + PADDING;
    const top = -BOX_HEIGHT / 2 + PADDING;
    const wrap = { width: BOX_WIDTH - PADDING * 2 };
    this.title = scene.add.text(left, top, '', TEXT.normal);
    // 사람이 쓴 글은 노란 종이 위에 적힌 것처럼 보인다.
    this.paper = scene.add.rectangle(0, top + 44, BOX_WIDTH - PADDING * 2, 290, COLORS.yellow)
      .setStrokeStyle(OUTLINE, COLORS.navy).setOrigin(0.5, 0);
    this.body = scene.add.text(left + 14, top + 58, '', {
      ...TEXT.normal,
      wordWrap: { width: wrap.width - 28 },
      lineSpacing: 4,
    });
    this.comment = scene.add.text(left, top + 350, '', { ...TEXT.normal, wordWrap: wrap });
    const hint = scene.add.text(BOX_WIDTH / 2 - PADDING, BOX_HEIGHT / 2 - 14, 'Enter로 닫기', TEXT.small)
      .setOrigin(1, 1);
    this.container.add([this.title, this.paper, this.body, this.comment, hint]);

    scene.input.keyboard.on('keydown-ENTER', () => {
      if (this.isOpen) this.confirm();
    });
  }

  // clue: { title, body, comment }
  open(clue, onClose = null) {
    this.onClose = onClose;
    this.title.setText(clue.title);
    this.body.setText(clue.body);
    this.comment.setText(`구구: "${clue.comment}"`);
    this.isOpen = true;
    this.container.setVisible(true);
  }

  close() {
    this.isOpen = false;
    this.justClosed = true; // 닫을 때 누른 Enter가 구구의 쪼기로 이어지지 않게 한다.
    this.container.setVisible(false);
  }

  confirm() {
    this.close();
    this.onClose?.();
  }
}
