import { COLORS, OUTLINE, TEXT } from './style.js';
import { createButton } from './button.js';

// 플레이 화면 UI (design.md 배치: 오른쪽 위에 스태미나 막대, 그 옆에 수첩 버튼)
const MARGIN = 20;
const TOP = 36; // 위에서부터 UI 가운데까지
const BAR_WIDTH = 160;
const BAR_HEIGHT = 16;
const ROW_GAP = 10; // 스태미나 막대와 경계 게이지 사이

export default class Hud {
  // onNotebook: 수첩 버튼을 눌렀을 때 부를 함수
  // getAlert: 경계 게이지 비율(0~1)을 돌려주는 함수. 있으면 스태미나 막대 아래에 경계 게이지를 그린다.
  constructor(scene, gugu, onNotebook, getAlert = null) {
    this.gugu = gugu;
    this.getAlert = getAlert;
    const depth = 90;

    const button = createButton(scene, 0, TOP, '수첩 (N)', onNotebook).setDepth(depth);
    button.x = scene.scale.width - MARGIN - button.width / 2;

    // 스태미나 막대: 회색 바탕 위에 남은 만큼 노랗게 채운다.
    this.barX = button.x - button.width / 2 - 16 - BAR_WIDTH;
    this.barY = TOP - BAR_HEIGHT / 2;
    scene.add.text(this.barX - 8, TOP, '스태미나', TEXT.small).setOrigin(1, 0.5).setDepth(depth);
    this.bar = scene.add.graphics().setDepth(depth);

    this.alertY = this.barY + BAR_HEIGHT + ROW_GAP;
    if (getAlert) {
      scene.add.text(this.barX - 8, this.alertY + BAR_HEIGHT / 2, '경계', TEXT.small)
        .setOrigin(1, 0.5).setDepth(depth);
    }
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

    // 경계 게이지: 평소 노랑, 가득 차면 빨강
    if (!this.getAlert) return;
    const alert = this.getAlert();
    this.bar.fillStyle(COLORS.gray);
    this.bar.fillRect(this.barX, this.alertY, BAR_WIDTH, BAR_HEIGHT);
    this.bar.fillStyle(alert >= 1 ? COLORS.red : COLORS.yellow);
    this.bar.fillRect(this.barX, this.alertY, BAR_WIDTH * alert, BAR_HEIGHT);
    this.bar.strokeRect(this.barX, this.alertY, BAR_WIDTH, BAR_HEIGHT);
  }
}
