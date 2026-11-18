// 플레이어 비둘기 '구구'. 그래픽 스타일이 [미정]이라 지금은 회색 원으로 그린다.
const WALK_SPEED = 200;
const FLY_SCALE = 1.3; // 날고 있을 때 커 보이는 정도
const SHADOW_OFFSET_Y = 14; // 날고 있을 때 그림자가 떨어져 보이는 거리

import { inventory } from '../systems/inventory.js';

// 비행 스태미나 (임시 값): 가득 찬 상태에서 4초 날 수 있고, 땅에서 5초면 다시 가득 찬다.
// '비행 스태미나 기초 강화'를 얻으면 최대치가 150이 되어 6초 날 수 있다.
const STAMINA_MAX = 100;
const STAMINA_MAX_UPGRADED = 150;
const STAMINA_DRAIN = 25; // 날 때 1초에 줄어드는 양
const STAMINA_REGEN = 20; // 땅에 있을 때 1초에 차는 양

const COLOR = 0x9aa0a6;
const PECK_FLASH_COLOR = 0xffffff; // 쪼는 순간 잠깐 바뀌는 색
const PECK_FLASH_MS = 100;

export default class Gugu {
  // onPeck(x, y): Enter로 쪼았을 때 장면에 알려 주는 함수
  constructor(scene, x, y, onPeck) {
    this.scene = scene;
    this.onPeck = onPeck;

    // 그림자를 먼저 만들어 구구 아래에 그려지게 한다.
    this.shadow = scene.add.ellipse(x, y, 30, 14, 0x000000, 0.35).setVisible(false);

    this.sprite = scene.add.circle(x, y, 16, COLOR);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(true);

    this.isFlying = false;
    this.stamina = this.maxStamina;
    this.exhausted = false; // 스태미나가 바닥나면 스페이스를 뗄 때까지 다시 날 수 없다.

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
      return;
    }

    // 환풍구 안: 움직이지 않고 떠 있다가, 스페이스를 눌렀다 떼면 바닥으로 내려앉는다.
    if (this.inVent) {
      this.sprite.body.setVelocity(0, 0);
      this.shadow.setPosition(this.sprite.x, this.sprite.y + SHADOW_OFFSET_Y);
      if (spaceReleased) {
        this.inVent = false;
        this.setFlying(false);
      }
      return;
    }

    const dx = (k.RIGHT.isDown || k.D.isDown) - (k.LEFT.isDown || k.A.isDown);
    const dy = (k.DOWN.isDown || k.S.isDown) - (k.UP.isDown || k.W.isDown);

    // 대각선으로 움직여도 속도가 같도록 방향을 정규화한다.
    const velocity = new Phaser.Math.Vector2(dx, dy).normalize().scale(WALK_SPEED);
    this.sprite.body.setVelocity(velocity.x, velocity.y);

    this.updateStamina(delta / 1000);
    this.setFlying(k.SPACE.isDown && !this.exhausted);
    this.shadow.setPosition(this.sprite.x, this.sprite.y + SHADOW_OFFSET_Y);

    if (peckPressed) this.peck();
  }

  // 체크포인트로 되돌아간다. 땅에 내려앉고 스태미나는 다시 가득 찬다.
  respawn(x, y) {
    this.sprite.body.reset(x, y);
    this.setFlying(false);
    this.stamina = this.maxStamina;
    this.exhausted = false;
    this.shadow.setPosition(x, y + SHADOW_OFFSET_Y);
  }

  // 환풍구 안에서 날고 있는 상태로 시작한다.
  enterVent() {
    this.inVent = true;
    this.setFlying(true);
  }

  peck() {
    this.sprite.setFillStyle(PECK_FLASH_COLOR);
    this.scene.time.delayedCall(PECK_FLASH_MS, () => this.sprite.setFillStyle(COLOR));
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
