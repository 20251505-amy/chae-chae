import { COLORS, OUTLINE, TEXT } from './style.js';

// design.md의 버튼: 모서리 둥근 노랑 사각형, 진남색 외곽선 3px, 진남색 글자 22px.
// 가리키면 1.05배, 누르면 0.95배가 되고, 손을 떼면 onClick을 부른다.
const HEIGHT = 44;
const PADDING_X = 16;
const CORNER = 12;

export function createButton(scene, x, y, label, onClick) {
  const text = scene.add.text(0, 0, label, TEXT.normal).setOrigin(0.5);
  const width = text.width + PADDING_X * 2;

  const bg = scene.add.graphics();
  bg.fillStyle(COLORS.yellow);
  bg.fillRoundedRect(-width / 2, -HEIGHT / 2, width, HEIGHT, CORNER);
  bg.lineStyle(OUTLINE, COLORS.navy);
  bg.strokeRoundedRect(-width / 2, -HEIGHT / 2, width, HEIGHT, CORNER);

  const button = scene.add.container(x, y, [bg, text])
    .setSize(width, HEIGHT)
    .setInteractive({ useHandCursor: true });

  button.on('pointerover', () => button.setScale(1.05));
  button.on('pointerout', () => button.setScale(1));
  button.on('pointerdown', () => button.setScale(0.95));
  button.on('pointerup', () => {
    button.setScale(1.05);
    onClick();
  });

  return button;
}
