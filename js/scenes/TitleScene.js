import Gugu from '../objects/Gugu.js';
import { COLORS, CSS_COLORS, OUTLINE, TEXT } from '../ui/style.js';

// 시작 화면: 아무 키나 누르거나 클릭하면 Stage 01을 시작한다.
// design.md '시작 화면'에 따라 5가지 색 안에서 움직임과 그림으로 꾸민다.
const TITLE = '총장님의 새우깡을 훔쳐라!';
const TITLE_STYLE = {
  ...TEXT.large,
  fontSize: '72px',
  color: CSS_COLORS.yellow,
  stroke: CSS_COLORS.navy,
  strokeThickness: 10,
};
const SHADOW = 'rgba(43, 45, 66, 0.35)'; // 진남색 35%

const BAG = { x: 640, y: 480 }; // 새우깡 봉지
const FLIGHT = { rx: 330, ry: 110, speed: 0.0012 }; // 구구가 봉지 둘레를 나는 타원 (반지름, 1ms당 각도)
const GUGU_SCALE = 1.6;
const CRACKER_INTERVAL = 350; // 떨어지는 새우깡이 나오는 간격 (ms)

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const { width, height } = this.scale;

    this.drawFootprints();
    this.time.addEvent({ delay: CRACKER_INTERVAL, loop: true, callback: () => this.dropCracker() });

    // 제목: 통통 튀며 나타난 뒤 위아래로 천천히 흔들린다.
    const title = this.add.text(width / 2, 200, TITLE, TITLE_STYLE)
      .setOrigin(0.5).setShadow(0, 6, SHADOW, 0, true, true).setScale(0).setDepth(10);
    this.tweens.add({
      targets: title,
      scale: 1,
      duration: 700,
      ease: 'Back.easeOut',
      onComplete: () => this.tweens.add({
        targets: title, y: title.y - 10, duration: 1200, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      }),
    });

    this.drawSnackBag();
    this.createFlyingGugu();

    const prompt = this.add.text(width / 2, height - 60, '아무 키나 누르거나 클릭하면 시작', TEXT.normal)
      .setOrigin(0.5).setDepth(10);
    this.tweens.add({ targets: prompt, alpha: 0.2, duration: 800, yoyo: true, repeat: -1 });

    this.input.keyboard.once('keydown', this.startGame, this);
    this.input.once('pointerdown', this.startGame, this);
  }

  update(time) {
    // 구구가 봉지 둘레 타원을 따라 날고, 나는 쪽을 바라본다.
    const a = time * FLIGHT.speed;
    const x = BAG.x + Math.cos(a) * FLIGHT.rx;
    const y = BAG.y + Math.sin(a) * FLIGHT.ry;
    this.gugu.setPosition(x, y).setRotation(Math.atan2(Math.cos(a) * FLIGHT.ry, -Math.sin(a) * FLIGHT.rx));
    this.guguShadow.setPosition(x, y + 24);
  }

  createFlyingGugu() {
    this.guguShadow = this.add.ellipse(0, 0, 44, 20, COLORS.navy, 0.35).setDepth(4);
    const g = this.add.graphics();
    Gugu.drawLook(g, COLORS.gray);
    this.gugu = this.add.container(0, 0, [g]).setScale(GUGU_SCALE).setDepth(6);
    this.update(0);
  }

  // 가운데 아래의 새우깡 봉지. 살짝 좌우로 흔들린다.
  drawSnackBag() {
    const g = this.add.graphics();
    g.lineStyle(OUTLINE, COLORS.navy);
    g.fillStyle(COLORS.yellow);
    g.fillRoundedRect(-60, -70, 120, 140, 14);
    g.strokeRoundedRect(-60, -70, 120, 140, 14);

    // 위아래 톱니 모양 접합부
    [-70, 70].forEach((edge) => {
      g.beginPath();
      g.moveTo(-60, edge);
      for (let i = 0; i < 8; i += 1) {
        g.lineTo(-60 + 15 * i + 7.5, edge + (edge < 0 ? -6 : 6));
        g.lineTo(-60 + 15 * (i + 1), edge);
      }
      g.strokePath();
    });

    // 가운데 크림색 이름표와 새우깡 그림
    g.fillStyle(COLORS.cream);
    g.fillRoundedRect(-46, -20, 92, 40, 10);
    g.strokeRoundedRect(-46, -20, 92, 40, 10);
    this.drawCrackerShape(g, 0, 42, 1.4);

    const label = this.add.text(0, 0, '새우깡', TEXT.normal).setOrigin(0.5);
    const bag = this.add.container(BAG.x, BAG.y, [g, label]).setDepth(5);
    this.tweens.add({
      targets: bag, angle: { from: -4, to: 4 }, duration: 900, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });
  }

  // 새우깡 한 개: 진남색 외곽선을 두른 노랑 활 모양
  drawCrackerShape(g, x, y, scale = 1) {
    const r = 10 * scale;
    g.lineStyle(9 * scale, COLORS.navy);
    g.beginPath();
    g.arc(x, y, r, Math.PI * 1.1, Math.PI * 1.9);
    g.strokePath();
    g.lineStyle(5 * scale, COLORS.yellow);
    g.beginPath();
    g.arc(x, y, r, Math.PI * 1.1, Math.PI * 1.9);
    g.strokePath();
  }

  // 위에서 새우깡 하나가 빙글빙글 돌며 천천히 떨어진다.
  dropCracker() {
    const g = this.add.graphics();
    this.drawCrackerShape(g, 0, 0, Phaser.Math.FloatBetween(0.8, 1.3));
    g.setPosition(Phaser.Math.Between(20, this.scale.width - 20), -20).setDepth(1);
    this.tweens.add({
      targets: g,
      y: this.scale.height + 20,
      angle: Phaser.Math.Between(-360, 360),
      duration: Phaser.Math.Between(4000, 7000),
      onComplete: () => g.destroy(),
    });
  }

  // 바탕에 옅게 지나가는 비둘기 발자국 두 줄
  drawFootprints() {
    const g = this.add.graphics().setDepth(0);
    g.lineStyle(OUTLINE, COLORS.navy, 0.15);
    const trails = [
      { x: 40, y: 660, dx: 70, dy: -38 },
      { x: 860, y: 700, dx: 60, dy: -45 },
    ];
    trails.forEach(({ x, y, dx, dy }) => {
      const angle = Math.atan2(dy, dx);
      for (let i = 0; i < 9; i += 1) {
        const side = i % 2 === 0 ? -1 : 1; // 왼발 · 오른발을 엇갈려 찍는다
        const px = x + dx * i + Math.cos(angle + Math.PI / 2) * side * 8;
        const py = y + dy * i + Math.sin(angle + Math.PI / 2) * side * 8;
        this.drawFootprint(g, px, py, angle);
      }
    });
  }

  // 발자국 하나: 앞으로 벌어진 발가락 세 개와 뒤로 하나
  drawFootprint(g, x, y, angle) {
    [-0.5, 0, 0.5].forEach((spread) => {
      g.lineBetween(x, y, x + Math.cos(angle + spread) * 12, y + Math.sin(angle + spread) * 12);
    });
    g.lineBetween(x, y, x - Math.cos(angle) * 6, y - Math.sin(angle) * 6);
  }

  startGame() {
    this.scene.start('StoryScene');
  }
}
