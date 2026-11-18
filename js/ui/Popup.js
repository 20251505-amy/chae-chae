import { COLORS, OUTLINE, TEXT } from './style.js';
import { createButton } from './button.js';

// 가운데 팝업 (design.md: 제목, 한 줄 설명, 버튼 하나). 실패 · 스테이지 클리어 화면에 쓴다.
// 버튼을 누르거나 Enter를 누르면 닫히고 onConfirm을 부른다.
const BOX_WIDTH = 460;
const BOX_HEIGHT = 240;

export default class Popup {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;

    const { width, height } = scene.scale;
    this.container = scene.add.container(width / 2, height / 2).setDepth(130).setVisible(false);
    this.container.add(scene.add.rectangle(0, 0, width, height, COLORS.navy, 0.35));
    this.container.add(scene.add.rectangle(0, 0, BOX_WIDTH, BOX_HEIGHT, COLORS.cream)
      .setStrokeStyle(OUTLINE, COLORS.navy));
    this.title = scene.add.text(0, -70, '', TEXT.large).setOrigin(0.5);
    this.text = scene.add.text(0, -10, '', {
      ...TEXT.normal,
      align: 'center',
      wordWrap: { width: BOX_WIDTH - 40 },
    }).setOrigin(0.5);
    this.container.add([this.title, this.text]);

    scene.input.keyboard.on('keydown', (event) => {
      if (this.isOpen && (event.code === 'Enter' || event.code === 'NumpadEnter')) this.confirm();
    });
  }

  // titleColor: CSS 색 문자열 (style.js의 CSS_COLORS)
  open({ title, titleColor, text, buttonLabel, onConfirm }) {
    this.onConfirm = onConfirm;
    this.title.setText(title).setColor(titleColor);
    this.text.setText(text);
    this.button?.destroy();
    this.button = createButton(this.scene, 0, 65, `${buttonLabel} (Enter)`, () => this.confirm());
    this.container.add(this.button);
    this.isOpen = true;
    this.container.setVisible(true);
  }

  close() {
    this.isOpen = false;
    this.justClosed = true; // 닫을 때 누른 Enter가 구구의 쪼기로 이어지지 않게 한다.
    this.container.setVisible(false);
  }

  confirm() {
    if (!this.isOpen) return;
    this.close();
    this.onConfirm();
  }
}
