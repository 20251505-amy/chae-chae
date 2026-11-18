import { COLORS, OUTLINE, TEXT } from './style.js';
import { createButton } from './button.js';

// 플레이 화면 UI (design.md 배치: 오른쪽 위에 스태미나 막대, 그 옆에 수첩 버튼)
const MARGIN = 20;
const TOP = 36; // 위에서부터 UI 가운데까지
const BAR_WIDTH = 160;
const BAR_HEIGHT = 16;

export default class Hud {
  // onNotebook: 수첩 버튼을 눌렀을 때 부를 함수
  constructor(scene, gugu, onNotebook) {
    this.gugu = gugu;
    const depth = 90;

    const button = createButton(scene, 0, TOP, '수첩 (N)', onNotebook).setDepth(depth);
    button.x = scene.scale.width - MARGIN - button.width / 2;

    // 스태미나 막대: 회색 바탕 위에 남은 만큼 노랗게 채운다.
    this.barX = button.x - button.width / 2 - 16 - BAR_WIDTH;
    this.barY = TOP - BAR_HEIGHT / 2;
    scene.add.text(this.barX - 8, TOP, '스태미나', TEXT.small).setOrigin(1, 0.5).setDepth(depth);
    this.bar = scene.add.graphics().setDepth(depth);
    this.update();
  }

  update() {
    const ratio = this.gugu.stamina / this.gugu.maxStamina;
    this.bar.clear();
    this.bar.fillStyle(COLORS.gray);
    this.bar.fillRect(this.barX, this.barY, BAR_WIDTH, BAR_HEIGHT);
    this.bar.fillStyle(COLORS.yellow);
    this.bar.fillRect(this.barX, this.barY, BAR_WIDTH * ratio, BAR_HEIGHT);
    this.bar.lineStyle(OUTLINE, COLORS.navy);
    this.bar.strokeRect(this.barX, this.barY, BAR_WIDTH, BAR_HEIGHT);
  }
}
