import { notebook } from '../systems/notebook.js';

// 발자국 수첩 화면. N 키로 열고 닫으며, 열려 있어도 게임은 멈추지 않는다.
// 디자인은 [미정]이라 지금은 반투명 상자에 단서 이름만 보여 준다.
const WIDTH = 320;
const PADDING = 16;

export default class NotebookPanel {
  constructor(scene) {
    const x = scene.scale.width - WIDTH - 20;
    const y = 20;
    const height = scene.scale.height - 40;

    this.container = scene.add.container(x, y).setDepth(100).setVisible(false);
    this.container.add(scene.add.rectangle(0, 0, WIDTH, height, 0x000000, 0.7).setOrigin(0));
    this.container.add(scene.add.text(PADDING, PADDING, '발자국 수첩', {
      fontSize: '22px',
      color: '#ffffff',
    }));
    this.list = scene.add.text(PADDING, PADDING + 40, '', {
      fontSize: '18px',
      color: '#dddddd',
      wordWrap: { width: WIDTH - PADDING * 2 },
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
