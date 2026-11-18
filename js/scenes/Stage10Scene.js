import StageScene from './StageScene.js';
import President from '../objects/President.js';
import TimingPanel from '../ui/TimingPanel.js';
import { COLORS, OUTLINE, TEXT } from '../ui/style.js';

// design.md에 따라 둥근 도형과 진남색 외곽선, 작은 글씨 이름표로 그린다.
const LABEL_STYLE = TEXT.small;
const VENT = { x: 640, y: 90 };
const SNACK_BAG = { x: 640, y: 400 }; // 책상 위 새우깡 봉지
const BAG_HIT_RANGE = 25; // 날고 있는 구구가 이만큼 가까워지면 봉지에 부딪힌다 (픽셀)
const BALCONY_WINDOW = { x: 1265, y: 400, width: 20, height: 220 };
const PRESIDENT = { x: 1120, y: 400 };
const PAPER_INTERVAL = 1000; // 서류 뭉치를 던지는 간격 (ms)
const PAPER_SPEED = 300; // 서류 뭉치가 1초에 날아가는 픽셀

export default class Stage10Scene extends StageScene {
  constructor() {
    super('Stage10Scene', {
      number: '10',
      name: '대학본부 최상층 총장실',
      start: VENT, // 체크포인트도 환풍구
      startInVent: true,
    });
  }

  create() {
    this.drawRoom();
    super.create();
    this.npcs.push(new President(this, PRESIDENT.x, PRESIDENT.y));

    // 총장님이 던지는 서류 뭉치. 구구가 맞으면 환풍구로 돌아간다.
    this.attacking = false;
    this.papers = this.physics.add.group();
    this.physics.add.overlap(this.gugu.sprite, this.papers, () => this.hitByPaper());

    // 책상 위 새우깡 봉지를 Enter로 쪼면 타이밍 미니게임이 열린다.
    this.timingPanel = new TimingPanel(this);
    this.panels.push(this.timingPanel);
    this.gotSnack = false;
    this.peckables.push({
      ...SNACK_BAG,
      onPeck: () => this.peckSnackBag(),
    });

    this.showMessage('스페이스를 눌렀다 떼면 환풍구에서 내려간다');
  }

  update(time, delta) {
    if (this.escaped) return;
    super.update(time, delta);
    if (this.popup.isOpen) return;

    // 새우깡을 꺼낸 뒤 발코니 창문에 닿으면 탈출 → 최종 성공
    if (this.gotSnack && this.touchesWindow()) {
      this.escape();
      return;
    }

    // 날고 있는 상태로 봉지에 부딪히면 봉지가 넘어져 즉시 발각된다.
    const { x, y } = this.gugu.sprite;
    if (this.gugu.isFlying
      && Phaser.Math.Distance.Between(x, y, SNACK_BAG.x, SNACK_BAG.y) <= BAG_HIT_RANGE) {
      this.caught('봉지를 넘어뜨렸다! 바스락...');
    }

    // 화면 밖으로 나간 서류 뭉치는 지운다.
    this.papers.getChildren().slice().forEach((paper) => {
      if (!this.physics.world.bounds.contains(paper.x, paper.y)) paper.destroy();
    });
  }

  // 새우깡을 꺼낸 뒤 발각되면 환풍구로 돌아가지 않고, 그 자리에서 총장님의 공격이 시작된다.
  caught(message) {
    if (!this.gotSnack) {
      super.caught(message);
      return;
    }
    if (!this.attacking) this.startAttack();
  }

  startAttack() {
    this.attacking = true;
    this.panels.forEach((p) => { if (p.isOpen) p.close(); });
    this.showMessage('들켰다! 총장님이 서류 뭉치를 던진다! 창문까지 도망쳐!');
    this.throwPaper();
    this.attackTimer = this.time.addEvent({
      delay: PAPER_INTERVAL,
      loop: true,
      callback: () => this.throwPaper(),
    });
  }

  stopAttack() {
    this.attacking = false;
    this.attackTimer?.remove();
    this.papers.clear(true, true);
  }

  // 총장님 자리에서 구구가 있는 쪽으로 서류 뭉치를 던진다.
  throwPaper() {
    const paper = this.add.rectangle(PRESIDENT.x, PRESIDENT.y, 16, 12, COLORS.cream)
      .setStrokeStyle(OUTLINE, COLORS.red);
    this.papers.add(paper);
    const angle = Phaser.Math.Angle.Between(PRESIDENT.x, PRESIDENT.y, this.gugu.sprite.x, this.gugu.sprite.y);
    paper.body.setVelocity(Math.cos(angle) * PAPER_SPEED, Math.sin(angle) * PAPER_SPEED);
  }

  // 서류 뭉치에 맞으면 환풍구로 돌아가고, 새우깡도 다시 꺼내야 한다.
  hitByPaper() {
    if (!this.attacking) return; // 같은 순간에 여러 장에 맞아도 한 번만 처리한다.
    this.stopAttack();
    this.gotSnack = false;
    super.caught('서류 뭉치에 맞았다! 새우깡을 놓치고 방생되었다...');
  }

  touchesWindow() {
    const w = BALCONY_WINDOW;
    const area = new Phaser.Geom.Rectangle(w.x - w.width / 2, w.y - w.height / 2, w.width, w.height);
    return Phaser.Geom.Intersects.CircleToRectangle(
      new Phaser.Geom.Circle(this.gugu.sprite.x, this.gugu.sprite.y, this.gugu.sprite.radius), area);
  }

  // 최종 성공 → 엔딩 화면으로 간다.
  escape() {
    this.escaped = true;
    this.stopAttack();
    this.scene.start('EndingScene');
  }

  // 이미 1개를 꺼냈는데 또 쪼면 2개째를 집은 것이라 즉시 발각된다.
  peckSnackBag() {
    if (this.gotSnack) {
      this.caught('욕심내서 2개째를 집다가 들켰다!');
      return;
    }
    this.timingPanel.open(
      () => {
        this.gotSnack = true;
        this.showMessage('새우깡 1개를 꺼냈다!');
      },
      () => this.caught('바스락! 봉지 소리에 들켰다...'),
    );
  }

  // 방 배치: 위쪽 가운데 천장 환풍구, 가운데 책상, 오른쪽 창가에 총장님, 오른쪽 끝 발코니 창문
  drawRoom() {
    this.add.rectangle(VENT.x, VENT.y, 80, 50, COLORS.gray).setStrokeStyle(OUTLINE, COLORS.navy);
    this.add.text(VENT.x, VENT.y - 40, '천장 환풍구', LABEL_STYLE).setOrigin(0.5);

    this.add.rectangle(640, 400, 220, 120, COLORS.gray).setStrokeStyle(OUTLINE, COLORS.navy);
    this.add.text(640, 475, '책상', LABEL_STYLE).setOrigin(0.5);
    this.add.rectangle(SNACK_BAG.x, SNACK_BAG.y, 30, 22, COLORS.yellow)
      .setStrokeStyle(OUTLINE, COLORS.navy);
    this.add.text(SNACK_BAG.x, SNACK_BAG.y - 25, '새우깡 봉지', LABEL_STYLE).setOrigin(0.5);

    this.add.text(1120, 435, '총장님', LABEL_STYLE).setOrigin(0.5);

    const w = BALCONY_WINDOW;
    this.add.rectangle(w.x, w.y, w.width, w.height, COLORS.cream).setStrokeStyle(OUTLINE, COLORS.navy);
    this.add.text(1235, 525, '발코니 창문', LABEL_STYLE).setOrigin(0.5);
  }
}
