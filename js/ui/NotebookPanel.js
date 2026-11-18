import { notebook } from '../systems/notebook.js';
import { COLORS, OUTLINE, TEXT } from './style.js';

// 발자국 수첩 화면. N 키로 열고 닫으며, 열려 있어도 게임은 멈추지 않는다.
// design.md에 따라 크림색 바탕, 진남색 외곽선과 글자로 그린다.
const WIDTH = 320;
const PADDING = 16;

export default class NotebookPanel {
  constructor(scene) {
    const x = scene.scale.width - WIDTH - 20;
    const y = 76; // 오른쪽 위 UI(스태미나 · 수첩 버튼) 아래부터
    const height = scene.scale.height - y - 20;

    this.container = scene.add.container(x, y).setDepth(100).setVisible(false);
    this.container.add(scene.add.rectangle(0, 0, WIDTH, height, COLORS.cream)
      .setStrokeStyle(OUTLINE, COLORS.navy).setOrigin(0));
    this.container.add(scene.add.text(PADDING, PADDING, '발자국 수첩', TEXT.normal));
    this.list = scene.add.text(PADDING, PADDING + 40, '', {
      ...TEXT.small,
      wordWrap: { width: WIDTH - PADDING * 2 },
      lineSpacing: 6,
    });
    this.container.add(this.list);

    scene.input.keyboard.on('keydown-N', () => this.toggle());
  }

  toggle() {
    this.container.setVisible(!this.container.visible);
    this.refresh();
  }

  refresh() {
    this.list.setText(notebook.clues.length
      ? notebook.clues.map((c) => `• ${c.name}`).join('\n')
      : '아직 모은 단서가 없다.');
  }
}
