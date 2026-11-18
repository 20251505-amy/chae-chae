// 정밀 타이밍 미니게임. 막대 위를 왕복하는 표시가 노란 칸에 들어왔을 때 Enter를 누르면 성공, 빗나가면 실패.
// 게임은 멈추지 않는다. design.md에 따라 크림색 창, 회색 막대, 노란 칸, 진남색 표시로 그린다.
import { COLORS, OUTLINE, TEXT } from './style.js';

const BAR_WIDTH = 400;
const ZONE_WIDTH = 40; // 노란 칸 너비 (좁을수록 어렵다)
const SPEED = 500; // 표시가 1초에 움직이는 픽셀

export default class TimingPanel {
  constructor(scene) {
    this.isOpen = false;

    const { width, height } = scene.scale;
    this.container = scene.add.container(width / 2, height - 110).setDepth(110).setVisible(false);
    this.container.add(scene.add.rectangle(0, 0, 460, 110, COLORS.cream)
      .setStrokeStyle(OUTLINE, COLORS.navy));
    this.container.add(scene.add.text(0, -30, '노란 칸에서 Enter로 새우깡 1개 꺼내기', TEXT.normal)
      .setOrigin(0.5));
    this.container.add(scene.add.rectangle(0, 15, BAR_WIDTH, 24, COLORS.gray)
      .setStrokeStyle(OUTLINE, COLORS.navy));
    this.zone = scene.add.rectangle(0, 15, ZONE_WIDTH, 24, COLORS.yellow);
    this.marker = scene.add.rectangle(0, 15, 6, 40, COLORS.navy);
    this.container.add([this.zone, this.marker]);

    scene.input.keyboard.on('keydown', (event) => {
      if (this.isOpen && (event.code === 'Enter' || event.code === 'NumpadEnter')) this.press();
    });
  }

  // onSuccess: 초록 칸에서 눌렀을 때, onFail: 빗나갔을 때
  open(onSuccess, onFail) {
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    const edge = BAR_WIDTH / 2 - ZONE_WIDTH / 2;
    this.zone.x = Phaser.Math.Between(-edge, edge); // 초록 칸 위치는 열 때마다 바뀐다
    this.markerX = -BAR_WIDTH / 2;
    this.direction = 1;
    this.isOpen = true;
    this.container.setVisible(true);
  }

  close() {
    this.isOpen = false;
    this.justClosed = true; // 닫을 때 누른 Enter가 구구의 쪼기로 이어지지 않게 한다.
    this.container.setVisible(false);
  }

  update(delta) {
    if (!this.isOpen) return;
    this.markerX += this.direction * SPEED * delta / 1000;
    if (Math.abs(this.markerX) >= BAR_WIDTH / 2) {
      this.markerX = Phaser.Math.Clamp(this.markerX, -BAR_WIDTH / 2, BAR_WIDTH / 2);
      this.direction = -this.direction;
    }
    this.marker.x = this.markerX;
  }

  press() {
    const hit = Math.abs(this.markerX - this.zone.x) <= ZONE_WIDTH / 2;
    this.close();
    if (hit) this.onSuccess();
    else this.onFail();
  }
}
