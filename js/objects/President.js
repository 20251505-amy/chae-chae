import Npc from './Npc.js';
import { COLORS, OUTLINE } from '../ui/style.js';

// 총장님. 제자리에 서서 창밖(오른쪽)과 방 안(왼쪽)을 불규칙하게 번갈아 본다.
// 창밖을 보는 동안에는 구구를 보지 못하고, 방 안을 볼 때는 크고 넓은 시야로 감지한다.
// 겉모습은 위에서 내려다본 정장 차림의 어른으로 그린다. design.md에 따라 실제 인물을 닮게 그리지 않는다.
const RADIUS = 20;
const WINDOW_TIME = [2000, 5000]; // 창밖을 보는 시간 (ms, 최소 ~ 최대)
const ROOM_TIME = [1000, 3000]; // 방 안을 보는 시간 (ms, 최소 ~ 최대)
const ROOM_VIEW_DISTANCE = 700;
const ROOM_VIEW_ANGLE = 90;

export default class President extends Npc {
  constructor(scene, x, y) {
    // 움직이지 않으므로 같은 지점 두 개를 길로 준다.
    super(scene, [{ x, y }, { x, y }], 0);
    this.scene = scene;
    this.sprite.setRadius(RADIUS).setVisible(false); // 위치 기준으로만 쓴다
    this.eye.setVisible(false);
    this.viewDistance = ROOM_VIEW_DISTANCE;
    this.viewAngle = ROOM_VIEW_ANGLE;

    const graphic = scene.add.graphics();
    this.drawBody(graphic);
    this.look = scene.add.container(x, y, [graphic]);

    this.lookAtWindow();
  }

  update(delta, gugu) {
    this.seesGugu = this.lookingAtRoom && gugu !== null && this.canSee(gugu.x, gugu.y);
    if (this.lookingAtRoom) this.drawView();
    else this.view.clear();
    this.look.setRotation(this.facing);
  }

  // 위에서 본 정장 차림. 오른쪽(0도)을 보는 모습으로 그리고, look을 돌려 고개 방향을 바꾼다.
  drawBody(g) {
    g.lineStyle(OUTLINE, COLORS.navy);

    // 양손 (어깨 앞쪽)
    g.fillStyle(COLORS.cream);
    [-1, 1].forEach((side) => {
      g.fillCircle(12, side * 19, 5);
      g.strokeCircle(12, side * 19, 5);
    });

    // 어깨와 정장 상의, 팔
    g.fillStyle(COLORS.navy);
    g.fillEllipse(0, 0, 26, 50);
    [-1, 1].forEach((side) => g.fillEllipse(5, side * 20, 16, 10));

    // 셔츠 깃과 넥타이 (가슴 앞쪽)
    g.fillStyle(COLORS.cream);
    g.fillTriangle(6, -6, 6, 6, 13, 0);
    g.fillStyle(COLORS.yellow);
    g.fillTriangle(7, -2, 7, 2, 13, 0);

    // 머리: 얼굴(크림)을 그리고 뒤쪽을 회색 머리카락으로 덮어 앞쪽만 얼굴이 보이게 한다
    g.lineStyle(OUTLINE, COLORS.navy);
    g.fillStyle(COLORS.cream);
    g.fillCircle(1, 0, 11);
    g.fillStyle(COLORS.gray);
    g.fillEllipse(-2, 0, 18, 22);
    g.strokeCircle(1, 0, 11);

    // 안경 (얼굴 앞쪽)
    g.lineStyle(1.5, COLORS.navy);
    g.strokeCircle(9, -4, 2.5);
    g.strokeCircle(9, 4, 2.5);

    // 코
    g.fillStyle(COLORS.cream);
    g.fillCircle(13, 0, 2.5);
    g.strokeCircle(13, 0, 2.5);
  }

  lookAtWindow() {
    this.facing = 0; // 오른쪽
    this.lookingAtRoom = false;
    this.scene.time.delayedCall(Phaser.Math.Between(...WINDOW_TIME), () => this.lookAtRoom());
  }

  lookAtRoom() {
    this.facing = Math.PI; // 왼쪽
    this.lookingAtRoom = true;
    this.scene.time.delayedCall(Phaser.Math.Between(...ROOM_TIME), () => this.lookAtWindow());
  }
}
