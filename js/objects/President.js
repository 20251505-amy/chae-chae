import Npc from './Npc.js';

// 총장님. 제자리에 서서 창밖(오른쪽)과 방 안(왼쪽)을 불규칙하게 번갈아 본다.
// 창밖을 보는 동안에는 구구를 보지 못하고, 방 안을 볼 때는 크고 넓은 시야로 감지한다.
const COLOR = 0x283593;
const WINDOW_TIME = [2000, 5000]; // 창밖을 보는 시간 (ms, 최소 ~ 최대)
const ROOM_TIME = [1000, 3000]; // 방 안을 보는 시간 (ms, 최소 ~ 최대)
const ROOM_VIEW_DISTANCE = 700;
const ROOM_VIEW_ANGLE = 90;

export default class President extends Npc {
  constructor(scene, x, y) {
    // 움직이지 않으므로 같은 지점 두 개를 길로 준다.
    super(scene, [{ x, y }, { x, y }], 0);
    this.scene = scene;
    this.sprite.setRadius(20).setFillStyle(COLOR);
    this.viewDistance = ROOM_VIEW_DISTANCE;
    this.viewAngle = ROOM_VIEW_ANGLE;
    this.lookAtWindow();
  }

  update(delta, gugu) {
    this.seesGugu = this.lookingAtRoom && gugu !== null && this.canSee(gugu.x, gugu.y);
    if (this.lookingAtRoom) this.drawView();
    else this.view.clear();
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
