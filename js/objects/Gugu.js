// 플레이어 비둘기 '구구'. 그래픽 스타일이 [미정]이라 지금은 회색 원으로 그린다.
const WALK_SPEED = 200;

export default class Gugu {
  constructor(scene, x, y) {
    this.sprite = scene.add.circle(x, y, 16, 0x9aa0a6);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(true);

    // 이동: 방향키 또는 WASD
    this.keys = scene.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT,W,A,S,D');
  }

  update() {
    const k = this.keys;
    const dx = (k.RIGHT.isDown || k.D.isDown) - (k.LEFT.isDown || k.A.isDown);
    const dy = (k.DOWN.isDown || k.S.isDown) - (k.UP.isDown || k.W.isDown);

    // 대각선으로 움직여도 속도가 같도록 방향을 정규화한다.
    const velocity = new Phaser.Math.Vector2(dx, dy).normalize().scale(WALK_SPEED);
    this.sprite.body.setVelocity(velocity.x, velocity.y);
  }
}
