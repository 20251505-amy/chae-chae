// 정해진 길을 왔다 갔다 하는 NPC. design.md에 따라 진남색 원 몸에 앞쪽을 보는 크림색 눈을 그린다.
// 앞쪽으로 부채꼴 시야를 보여 주고, 시야 안의 구구를 감지한다.
import { COLORS, OUTLINE } from '../ui/style.js';

const DEFAULT_SPEED = 80; // 1초에 움직이는 픽셀

const VIEW_DISTANCE = 150; // 시야 거리 (픽셀)
const VIEW_ANGLE = 60; // 시야 각도 (도)
const VIEW_COLOR = COLORS.yellow; // 평소 시야 색
const VIEW_ALERT_COLOR = COLORS.red; // 구구를 보고 있을 때 시야 색
const VIEW_ALPHA = 0.25;

// 쫓아내기: 시야 안의 구구가 이만큼 가까우면 팔을 휘둘러 쫓아낸다. 한 번 쓰면 잠시 다시 못 쓴다.
const SHOO_RANGE = 60; // 픽셀
const SHOO_COOLDOWN = 2000; // ms

export default class Npc {
  // path: [{ x, y }, ...] 지나갈 지점들. 끝에 닿으면 반대로 되돌아간다.
  // drawLook(graphics): 겉모습을 그리는 함수 (없으면 진남색 원 + 눈으로 그린다)
  constructor(scene, path, speed = DEFAULT_SPEED, drawLook = null) {
    this.scene = scene;
    this.path = path;
    this.onShoo = null; // 쫓아내기를 썼을 때 부를 함수 (장면이 넣는다. 없으면 쫓아내기를 쓰지 않는다)
    this.shooCooldown = 0;
    this.speed = speed;
    this.targetIndex = 1;
    this.step = 1; // 1이면 앞으로, -1이면 되돌아가는 중
    this.facing = Phaser.Math.Angle.Between(path[0].x, path[0].y, path[1].x, path[1].y);
    this.seesGugu = false;
    this.viewDistance = VIEW_DISTANCE;
    this.viewAngle = VIEW_ANGLE;

    // 시야를 먼저 만들어 NPC 아래에 그려지게 한다.
    this.view = scene.add.graphics();
    this.sprite = scene.add.circle(path[0].x, path[0].y, 14, COLORS.navy);
    this.eye = scene.add.circle(path[0].x, path[0].y, 4, COLORS.cream);

    // 겉모습이 따로 있으면 원과 눈은 숨기고(위치 기준으로만 쓴다), 겉모습이 바라보는 쪽으로 돈다.
    if (drawLook) {
      this.sprite.setVisible(false);
      this.eye.setVisible(false);
      const graphic = scene.add.graphics();
      drawLook(graphic);
      this.look = scene.add.container(path[0].x, path[0].y, [graphic]);
    }
  }

  // gugu: 감지할 위치 { x, y }. 날고 있어서 들키지 않을 때는 null.
  // 구구가 시야에 들어오면 멈춰 서서 구구 쪽으로 시야를 돌려 따라 본다.
  // 시야 거리 밖으로 벗어나거나 날아오르면 놓치고, 다시 순찰을 이어 간다.
  update(delta, gugu) {
    this.shooCooldown = Math.max(0, this.shooCooldown - delta);
    this.seesGugu = gugu !== null && this.canSee(gugu.x, gugu.y);
    if (this.seesGugu) {
      this.facing = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, gugu.x, gugu.y);
      const close = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, gugu.x, gugu.y) <= SHOO_RANGE;
      if (this.onShoo && close && this.shooCooldown === 0) this.shoo();
    } else {
      this.move(delta);
    }
    this.drawView();
    this.updateEye();
  }

  // 쫓아내기: 앞쪽으로 팔을 휘두르는 호를 잠깐 그리고, 장면에 알린다.
  shoo() {
    this.shooCooldown = SHOO_COOLDOWN;
    const swipe = this.scene.add.graphics();
    swipe.lineStyle(OUTLINE, COLORS.navy);
    swipe.beginPath();
    swipe.arc(this.sprite.x, this.sprite.y, 34, this.facing - 0.7, this.facing + 0.7);
    swipe.strokePath();
    this.scene.tweens.add({
      targets: swipe,
      alpha: 0,
      duration: 250,
      onComplete: () => swipe.destroy(),
    });
    this.onShoo(this);
  }

  // 눈(또는 겉모습)을 바라보는 쪽으로 옮긴다.
  updateEye() {
    if (this.look) {
      this.look.setPosition(this.sprite.x, this.sprite.y).setRotation(this.facing);
      return;
    }
    const reach = this.sprite.radius * 0.6;
    this.eye.setPosition(
      this.sprite.x + Math.cos(this.facing) * reach,
      this.sprite.y + Math.sin(this.facing) * reach,
    );
  }

  move(delta) {
    const target = this.path[this.targetIndex];
    const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, target.x, target.y);
    const move = this.speed * delta / 1000;

    if (distance <= move) {
      this.sprite.setPosition(target.x, target.y);
      this.nextTarget();
      return;
    }

    this.facing = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, target.x, target.y);
    this.sprite.x += Math.cos(this.facing) * move;
    this.sprite.y += Math.sin(this.facing) * move;
  }

  nextTarget() {
    const last = this.path.length - 1;
    if (this.targetIndex + this.step > last || this.targetIndex + this.step < 0) {
      this.step = -this.step;
    }
    this.targetIndex += this.step;
  }

  canSee(x, y) {
    const { x: nx, y: ny } = this.sprite;
    if (Phaser.Math.Distance.Between(nx, ny, x, y) > this.viewDistance) return false;
    const angleToTarget = Phaser.Math.Angle.Between(nx, ny, x, y);
    const diff = Math.abs(Phaser.Math.Angle.Wrap(angleToTarget - this.facing));
    return diff <= Phaser.Math.DegToRad(this.viewAngle / 2);
  }

  drawView() {
    const half = Phaser.Math.DegToRad(this.viewAngle / 2);
    this.view.clear();
    this.view.fillStyle(this.seesGugu ? VIEW_ALERT_COLOR : VIEW_COLOR, VIEW_ALPHA);
    this.view.slice(this.sprite.x, this.sprite.y, this.viewDistance,
      this.facing - half, this.facing + half, false);
    this.view.fillPath();
  }
}
