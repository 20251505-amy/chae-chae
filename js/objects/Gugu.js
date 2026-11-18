// 플레이어 비둘기 '구구'. design.md의 캐릭터 디자인(위에서 본 회색 비둘기)을 코드로 그린다.
// 충돌 판정은 보이지 않는 원(sprite)이 맡고, 겉모습(look)은 그 위치를 따라가며 바라보는 쪽으로 돈다.
import { inventory } from '../systems/inventory.js';
import { COLORS, OUTLINE } from '../ui/style.js';

const WALK_SPEED = 200;
const FLY_SCALE = 1.3; // 날고 있을 때 커 보이는 정도
const SHADOW_OFFSET_Y = 14; // 날고 있을 때 그림자가 떨어져 보이는 거리
const RADIUS = 16;

// 비행 스태미나 (임시 값): 가득 찬 상태에서 4초 날 수 있고, 땅에서 5초면 다시 가득 찬다.
// '비행 스태미나 기초 강화'를 얻으면 최대치가 150이 되어 6초 날 수 있다.
const STAMINA_MAX = 100;
const STAMINA_MAX_UPGRADED = 150;
const STAMINA_DRAIN = 25; // 날 때 1초에 줄어드는 양
const STAMINA_REGEN = 20; // 땅에 있을 때 1초에 차는 양

const PECK_FLASH_MS = 100; // 쪼는 순간 몸이 노랗게 바뀌는 시간

// 학생의 쫓아내기에 맞으면 이 시간 동안 이 거리만큼 튕겨 나간다.
const KNOCKBACK_DISTANCE = 150; // 픽셀
const KNOCKBACK_TIME = 200; // ms

export default class Gugu {
  // onPeck(x, y): Enter로 쪼았을 때 장면에 알려 주는 함수
  constructor(scene, x, y, onPeck) {
    this.scene = scene;
    this.onPeck = onPeck;

    // 그림자를 먼저 만들어 구구 아래에 그려지게 한다.
    this.shadow = scene.add.ellipse(x, y, 30, 14, COLORS.navy, 0.35).setVisible(false);

    this.sprite = scene.add.circle(x, y, RADIUS, COLORS.gray).setVisible(false);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(true);

    this.facing = 0;
    this.graphic = scene.add.graphics();
    this.look = scene.add.container(x, y, [this.graphic]);
    this.drawBody(COLORS.gray);

    this.isFlying = false;
    this.stamina = this.maxStamina;
    this.exhausted = false; // 스태미나가 바닥나면 스페이스를 뗄 때까지 다시 날 수 없다.
    this.knockbackLeft = 0; // 튕겨 나가는 중이면 남은 시간 (ms)

    // 이동: 방향키 또는 WASD / 비행: 스페이스를 누르는 동안 / 쪼기: Enter
    this.keys = scene.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT,W,A,S,D,SPACE,ENTER');
  }

  // canAct가 false이면 (키패드를 쓰는 중 등) 제자리에 멈춰 있는다.
  update(delta, canAct = true) {
    const k = this.keys;
    const peckPressed = Phaser.Input.Keyboard.JustDown(k.ENTER);
    const spaceReleased = Phaser.Input.Keyboard.JustUp(k.SPACE);

    if (!canAct) {
      this.sprite.body.setVelocity(0, 0);
      this.updateParts();
      return;
    }

    // 환풍구 안: 움직이지 않고 떠 있다가, 스페이스를 눌렀다 떼면 바닥으로 내려앉는다.
    if (this.inVent) {
      this.sprite.body.setVelocity(0, 0);
      this.updateParts();
      if (spaceReleased) {
        this.inVent = false;
        this.setFlying(false);
      }
      return;
    }

    // 튕겨 나가는 중: 정해진 방향으로 밀려난다.
    if (this.knockbackLeft > 0) {
      this.knockbackLeft -= delta;
      const { x, y } = this.knockbackVelocity;
      this.sprite.body.setVelocity(x, y);
      this.updateParts();
      return;
    }

    const dx = (k.RIGHT.isDown || k.D.isDown) - (k.LEFT.isDown || k.A.isDown);
    const dy = (k.DOWN.isDown || k.S.isDown) - (k.UP.isDown || k.W.isDown);
    if (dx || dy) this.facing = Math.atan2(dy, dx);

    // 대각선으로 움직여도 속도가 같도록 방향을 정규화한다.
    const velocity = new Phaser.Math.Vector2(dx, dy).normalize().scale(WALK_SPEED);
    this.sprite.body.setVelocity(velocity.x, velocity.y);

    this.updateStamina(delta / 1000);
    this.setFlying(k.SPACE.isDown && !this.exhausted);
    this.updateParts();

    if (peckPressed) this.peck();
  }

  // (fromX, fromY)에서 먼 쪽으로 튕겨 나간다.
  knockback(fromX, fromY) {
    const angle = Phaser.Math.Angle.Between(fromX, fromY, this.sprite.x, this.sprite.y);
    const speed = KNOCKBACK_DISTANCE / (KNOCKBACK_TIME / 1000);
    this.knockbackVelocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
    this.knockbackLeft = KNOCKBACK_TIME;
  }

  // 그림자와 겉모습을 충돌 원에 맞춰 옮긴다.
  updateParts() {
    const { x, y, scale } = this.sprite;
    this.shadow.setPosition(x, y + SHADOW_OFFSET_Y);
    this.look.setPosition(x, y).setRotation(this.facing).setScale(scale);
  }

  // 위에서 본 비둘기. 오른쪽(0도)을 바라보는 모습으로 그리고, look을 돌려 방향을 바꾼다.
  // 꼬리 끝 줄무늬 · 날개의 짙은 줄 두 개 · 작은 진남색 부리는 캐릭터 그림을 따른 것이다.
  drawBody(bodyColor) {
    const g = this.graphic;
    g.clear();
    g.lineStyle(OUTLINE, COLORS.navy);

    // 꼬리 (끝에 진남색 줄무늬)
    g.fillStyle(bodyColor);
    g.fillRoundedRect(-27, -7, 16, 14, 4);
    g.strokeRoundedRect(-27, -7, 16, 14, 4);
    g.fillStyle(COLORS.navy);
    g.fillRect(-27, -7, 4, 14);

    // 몸통
    g.fillStyle(bodyColor);
    g.fillEllipse(0, 0, 34, 28);
    g.strokeEllipse(0, 0, 34, 28);

    // 접힌 날개 두 쪽과 날개의 짙은 줄
    g.lineStyle(2, COLORS.navy);
    [-1, 1].forEach((side) => {
      g.fillStyle(bodyColor);
      g.fillEllipse(-4, side * 8, 24, 10);
      g.strokeEllipse(-4, side * 8, 24, 10);
      g.lineBetween(-10, side * 8, -5, side * 8);
      g.lineBetween(-3, side * 8, 2, side * 8);
    });

    // 머리
    g.lineStyle(OUTLINE, COLORS.navy);
    g.fillStyle(bodyColor);
    g.fillCircle(14, 0, 9);
    g.strokeCircle(14, 0, 9);

    // 눈과 부리
    g.fillStyle(COLORS.navy);
    g.fillCircle(17, -4, 1.8);
    g.fillCircle(17, 4, 1.8);
    g.fillTriangle(22, -3, 22, 3, 29, 0);
    g.fillStyle(COLORS.cream);
    g.fillCircle(22.5, 0, 1.5);
  }

  // 체크포인트로 되돌아간다. 땅에 내려앉고 스태미나는 다시 가득 찬다.
  respawn(x, y) {
    this.sprite.body.reset(x, y);
    this.knockbackLeft = 0;
    this.setFlying(false);
    this.stamina = this.maxStamina;
    this.exhausted = false;
    this.updateParts();
  }

  // 환풍구 안에서 날고 있는 상태로 시작한다.
  enterVent() {
    this.inVent = true;
    this.setFlying(true);
    this.updateParts();
  }

  peck() {
    this.drawBody(COLORS.yellow);
    this.scene.time.delayedCall(PECK_FLASH_MS, () => this.drawBody(COLORS.gray));
    this.onPeck(this.sprite.x, this.sprite.y);
  }

  get maxStamina() {
    return inventory.has('stamina-upgrade-1') ? STAMINA_MAX_UPGRADED : STAMINA_MAX;
  }

  updateStamina(seconds) {
    if (this.isFlying) {
      this.stamina = Math.max(0, this.stamina - STAMINA_DRAIN * seconds);
      if (this.stamina === 0) this.exhausted = true;
    } else {
      this.stamina = Math.min(this.maxStamina, this.stamina + STAMINA_REGEN * seconds);
    }
    if (!this.keys.SPACE.isDown) this.exhausted = false;
  }

  // 스페이스를 떼면 그 자리에 내려앉는다.
  setFlying(flying) {
    if (this.isFlying === flying) return;
    this.isFlying = flying;
    this.sprite.setScale(flying ? FLY_SCALE : 1);
    this.shadow.setVisible(flying);
  }
}
