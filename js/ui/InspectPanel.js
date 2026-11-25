import { COLORS, OUTLINE, TEXT } from './style.js';
import { drawPaper, PAPER_WIDTH, PAPER_HEIGHT } from './paperStyles.js';

// 자세히 보기 창 (design.md: 가운데). 단서를 찾거나 물건을 쪼아 살펴볼 때 연다.
// 가운데에는 단서 종류(신문 · 일기 · 쪽지 등)에 맞게 꾸민 종이가, 아래에는 구구의 한마디가 나온다.
// Enter를 누르면 닫히고 onClose를 부른다. 열려 있는 동안에는 게임이 멈춘다 (StageScene).
const PADDING = 28;
const BOX_WIDTH = PAPER_WIDTH + PADDING * 2;
const BOX_HEIGHT = 560;

export default class InspectPanel {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;

    const { width, height } = scene.scale;
    this.container = scene.add.container(width / 2, height / 2).setDepth(120).setVisible(false);
    // 창 뒤를 진남색 35%로 어둡게 한다.
    this.container.add(scene.add.rectangle(0, 0, width, height, COLORS.navy, 0.35));
    this.container.add(scene.add.rectangle(0, 0, BOX_WIDTH, BOX_HEIGHT, COLORS.cream)
      .setStrokeStyle(OUTLINE, COLORS.navy));

    const left = -BOX_WIDTH / 2 + PADDING;
    const top = -BOX_HEIGHT / 2 + PADDING;
    this.title = scene.add.text(left, top, '', TEXT.normal);
    // 단서마다 새로 그리는 종이를 담는다.
    this.paper = scene.add.container(0, top + 44 + PAPER_HEIGHT / 2);
    this.comment = scene.add.text(left, top + 58 + PAPER_HEIGHT, '', {
      ...TEXT.normal,
      wordWrap: { width: PAPER_WIDTH },
    });
    const hint = scene.add.text(BOX_WIDTH / 2 - PADDING, BOX_HEIGHT / 2 - 14, 'Enter로 닫기', TEXT.small)
      .setOrigin(1, 1);
    this.container.add([this.title, this.paper, this.comment, hint]);

    scene.input.keyboard.on('keydown-ENTER', () => {
      if (this.isOpen) this.confirm();
    });
  }

  // clue: { title, style, comment, ...종이에 그릴 값 (paperStyles.js) }
  open(clue, onClose = null) {
    this.onClose = onClose;
    this.title.setText(clue.title);
    this.paper.removeAll(true);
    this.paper.add(drawPaper(this.scene, clue));
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
