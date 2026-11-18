// 정해진 길을 왔다 갔다 하는 NPC. 그래픽 스타일이 [미정]이라 지금은 파란 원으로 그린다.
// 앞쪽으로 부채꼴 시야를 보여 주고, 시야 안의 구구를 감지한다.
const COLOR = 0x5b8def;
const DEFAULT_SPEED = 80; // 1초에 움직이는 픽셀

const VIEW_DISTANCE = 150; // 시야 거리 (픽셀)
const VIEW_ANGLE = 60; // 시야 각도 (도)
const VIEW_COLOR = 0xffff99; // 평소 시야 색
const VIEW_ALERT_COLOR = 0xff4444; // 구구를 보고 있을 때 시야 색
const VIEW_ALPHA = 0.25;

export default class Npc {
  // path: [{ x, y }, ...] 지나갈 지점들. 끝에 닿으면 반대로 되돌아간다.
  constructor(scene, path, speed = DEFAULT_SPEED) {
    this.path = path;
    this.speed = speed;
    this.targetIndex = 1;
    this.step = 1; // 1이면 앞으로, -1이면 되돌아가는 중
    this.facing = Phaser.Math.Angle.Between(path[0].x, path[0].y, path[1].x, path[1].y);
    this.seesGugu = false;
    this.viewDistance = VIEW_DISTANCE;
    this.viewAngle = VIEW_ANGLE;

    // 시야를 먼저 만들어 NPC 아래에 그려지게 한다.
    this.view = scene.add.graphics();
    this.sprite = scene.add.circle(path[0].x, path[0].y, 14, COLOR);
  }

  // gugu: 감지할 위치 { x, y }. 날고 있어서 들키지 않을 때는 null.
  update(delta, gugu) {
    this.move(delta);
    this.seesGugu = gugu !== null && this.canSee(gugu.x, gugu.y);
    this.drawView();
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
