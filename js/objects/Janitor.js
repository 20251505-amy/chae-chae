import Npc from './Npc.js';
import { COLORS } from '../ui/style.js';

// 청소 미화원. 학생처럼 정해진 길을 돌고 같은 시야로 감지하며, 구구를 보면 멈춰서 따라 본다.
// 겉모습은 design.md의 '그 밖의 NPC'(진남색 원 + 크림색 눈)이다.
// 일정 간격으로 앞쪽에 빗자루를 휘두르고, 그 부채꼴에 구구가 있으면 onBroomHit을 부른다.
const SWING_INTERVAL = 3000; // 빗자루를 휘두르는 간격 (ms)
const SWING_TIME = 500; // 한 번 휘두르는 시간 (ms)
const SWING_RANGE = 80; // 픽셀
const SWING_ANGLE = 90; // 도
const SWING_ALPHA = 0.45;

export default class Janitor extends Npc {
  // gugu: 빗자루에 맞았는지 볼 구구의 충돌 원 (날고 있어도 맞는다)
  constructor(scene, path, speed, gugu) {
    super(scene, path, speed);
    this.gugu = gugu;
    this.onBroomHit = null; // 장면이 넣는다
    this.swingTimer = SWING_INTERVAL;
    this.swingLeft = 0; // 휘두르는 중이면 남은 시간 (ms)
    this.broom = scene.add.graphics();
  }

  update(delta, target) {
    super.update(delta, target);

    this.swingTimer -= delta;
    if (this.swingTimer <= 0) {
      this.swingTimer = SWING_INTERVAL;
      this.swingLeft = SWING_TIME;
      this.hitThisSwing = false;
    }
    this.swingLeft = Math.max(0, this.swingLeft - delta);
    this.drawBroom();

    if (this.swingLeft > 0 && !this.hitThisSwing && this.inSwing(this.gugu.x, this.gugu.y)) {
      this.hitThisSwing = true;
      this.onBroomHit?.(this);
    }
  }

  inSwing(x, y) {
    const { x: jx, y: jy } = this.sprite;
    if (Phaser.Math.Distance.Between(jx, jy, x, y) > SWING_RANGE) return false;
    const diff = Math.abs(Phaser.Math.Angle.Wrap(Phaser.Math.Angle.Between(jx, jy, x, y) - this.facing));
    return diff <= Phaser.Math.DegToRad(SWING_ANGLE / 2);
  }

  drawBroom() {
    this.broom.clear();
    if (this.swingLeft === 0) return;
    const half = Phaser.Math.DegToRad(SWING_ANGLE / 2);
    this.broom.fillStyle(COLORS.red, SWING_ALPHA);
    this.broom.slice(this.sprite.x, this.sprite.y, SWING_RANGE, this.facing - half, this.facing + half, false);
    this.broom.fillPath();
  }
}
