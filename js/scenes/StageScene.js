import Gugu from '../objects/Gugu.js';
import Clue from '../objects/Clue.js';
import Npc from '../objects/Npc.js';
import Door from '../objects/Door.js';
import Janitor from '../objects/Janitor.js';
import { drawKeypad } from '../objects/props.js';
import { notebook } from '../systems/notebook.js';
import { inventory } from '../systems/inventory.js';
import NotebookPanel from '../ui/NotebookPanel.js';
import KeypadPanel from '../ui/KeypadPanel.js';
import InspectPanel from '../ui/InspectPanel.js';
import DialogBox from '../ui/DialogBox.js';
import { STAGE_INTRO } from '../data/story.js';
import Hud from '../ui/Hud.js';
import Popup from '../ui/Popup.js';
import { CSS_COLORS, TEXT } from '../ui/style.js';

const PECK_RANGE = 40; // 구구가 쪼을 수 있는 거리 (픽셀)
const CAUGHT_TIME = 1500; // 시야에 이만큼(ms) 계속 보이면 발각된다
const COO_RANGE = 200; // '구구' 울음소리가 들리는 거리 (픽셀)
const COO_BUBBLE_MS = 800; // "구구!" 말풍선이 떠 있는 시간

// 경계 게이지: 날갯짓 소음으로 찬다. 빗자루 · 서류 뭉치가 있는 스테이지에서만 쓴다.
const ALERT_MAX = 100;
const ALERT_RISE = 25; // 날고 있을 때 1초에 차는 양
const ALERT_FALL = 10; // 땅에 있을 때 1초에 주는 양
const ALERT_HIT = 40; // 게이지가 덜 찬 상태에서 빗자루 · 서류 뭉치에 맞으면 오르는 양

// 모든 스테이지가 함께 쓰는 탑다운 장면의 바탕.
// 새 스테이지는 이 클래스를 상속하고 key와 스테이지 정보만 넘기면 된다.
export default class StageScene extends Phaser.Scene {
  constructor(key, stage) {
    super(key);
    // { number: '01', name: '정문 & 향학로', start?: { x, y }, startInVent?: true, alertGauge?: true }
    // start가 없으면 화면 가운데에서 시작한다. startInVent이면 환풍구 안에서 날고 있는 상태로 시작한다.
    // alertGauge이면 경계 게이지를 쓰고 화면에 보여 준다.
    this.stage = stage;
  }

  create() {
    this.add.text(20, 20, `Stage ${this.stage.number}  ${this.stage.name}`, TEXT.normal);

    // 쪼을 수 있는 물건(스위치 · 키패드 등) 목록. 각 스테이지가 { x, y, onPeck() } 형태로 넣는다.
    this.peckables = [];
    this.npcs = [];
    this.students = []; // addNpc로 놓은 학생 (울음소리 · 쫓아내기는 학생만 해당)
    this.exposure = 0; // 구구가 시야에 계속 보인 시간 (ms)
    this.stageItems = []; // 이 스테이지에서 얻은 아이템 (클리어 화면에 보여 준다)

    // 체크포인트: 스테이지 시작 위치
    this.checkpoint = this.stage.start ?? { x: this.scale.width / 2, y: this.scale.height / 2 };
    this.gugu = new Gugu(this, this.checkpoint.x, this.checkpoint.y,
      (x, y) => this.handlePeck(x, y));
    if (this.stage.startInVent) this.gugu.enterVent();
    this.gugu.onCoo = (x, y) => this.coo(x, y);

    this.notebookPanel = new NotebookPanel(this);
    this.keypadPanel = new KeypadPanel(this);
    this.alert = 0;
    this.hud = new Hud(this, this.gugu, () => this.notebookPanel.toggle(),
      this.stage.alertGauge ? () => this.alert / ALERT_MAX : null);
    this.popup = new Popup(this); // 실패 · 클리어 화면
    this.inspectPanel = new InspectPanel(this); // 단서 · 물건 자세히 보기
    this.dialog = new DialogBox(this); // 구구의 대사
    // 열려 있는 동안 구구가 멈추는 창 목록 (스테이지가 더 넣을 수 있다)
    this.panels = [this.keypadPanel, this.popup, this.inspectPanel, this.dialog];
    // 열려 있는 동안 게임 전체가 멈추는 창 목록
    this.pausePanels = [this.popup, this.inspectPanel, this.dialog];

    // 스테이지를 시작할 때 구구가 이야기를 한다.
    const intro = STAGE_INTRO[this.stage.number];
    if (intro) this.dialog.open(intro);
  }

  get paused() {
    return this.pausePanels.some((p) => p.isOpen);
  }

  update(time, delta) {
    // 실패 · 클리어 화면, 자세히 보기 창, 대사창이 떠 있는 동안에는 모든 움직임을 멈춘다.
    if (this.paused) {
      this.gugu.update(delta, false);
      return;
    }

    const canAct = this.panels.every((p) => !p.isOpen && !p.justClosed);
    this.gugu.update(delta, canAct);
    if (this.stage.alertGauge) this.updateAlert(delta / 1000);
    this.hud.update();
    this.panels.forEach((p) => {
      p.justClosed = false;
      p.update?.(delta);
    });

    // 날고 있는 구구는 들키지 않는다.
    const target = this.gugu.isFlying ? null : this.gugu.sprite;
    this.npcs.forEach((npc) => npc.update(delta, target));
    this.guguSeen = this.npcs.some((npc) => npc.seesGugu);

    // 시야에서 벗어나면 다시 0부터 센다.
    this.exposure = this.guguSeen ? this.exposure + delta : 0;
    if (this.exposure >= CAUGHT_TIME) {
      this.exposure = 0;
      this.caught();
    }
  }

  // 발각되면 실패 화면을 띄우고, "다시 하기"를 누르면 '캠퍼스 밖 방생' → 체크포인트로 돌아간다.
  // 주운 단서와 아이템은 그대로 남는다.
  caught(message = '캠퍼스 밖으로 방생되었다...') {
    if (this.popup.isOpen) return;
    this.panels.forEach((p) => { if (p.isOpen) p.close(); });
    this.exposure = 0;
    this.popup.open({
      title: '발각!',
      titleColor: CSS_COLORS.red,
      text: message,
      buttonLabel: '다시 하기',
      onConfirm: () => {
        this.alert = 0;
        this.gugu.respawn(this.checkpoint.x, this.checkpoint.y);
        if (this.stage.startInVent) this.gugu.enterVent();
      },
    });
  }

  // 날고 있으면(환풍구 안 제외) 경계 게이지가 차고, 땅에 있으면 준다.
  updateAlert(seconds) {
    const flapping = this.gugu.isFlying && !this.gugu.inVent;
    const change = flapping ? ALERT_RISE : -ALERT_FALL;
    this.alert = Phaser.Math.Clamp(this.alert + change * seconds, 0, ALERT_MAX);
  }

  get alertFull() {
    return this.alert >= ALERT_MAX;
  }

  // 빗자루 · 서류 뭉치에 닿았을 때. 경계 게이지가 가득 찼으면 true(발각)를 돌려준다.
  // 덜 찼으면 (fromX, fromY) 반대쪽으로 튕겨 나가고 게이지가 오른다.
  hitByHazard(fromX, fromY) {
    if (this.alertFull) return true;
    this.gugu.knockback(fromX, fromY);
    this.alert = Math.min(ALERT_MAX, this.alert + ALERT_HIT);
    return false;
  }

  // 스테이지 클리어 화면: 얻은 아이템을 보여 주고, "다음 스테이지"를 누르면 nextSceneKey로 이동한다.
  clearStage(nextSceneKey) {
    if (this.popup.isOpen) return;
    this.panels.forEach((p) => { if (p.isOpen) p.close(); });
    const items = this.stageItems.map((i) => i.name).join(', ');
    this.popup.open({
      title: `Stage ${this.stage.number} 클리어!`,
      titleColor: CSS_COLORS.navy,
      text: items ? `획득: ${items}` : '획득한 아이템 없음',
      buttonLabel: '다음 스테이지',
      onConfirm: () => this.scene.start(nextSceneKey),
    });
  }

  // 정해진 길(path)을 왔다 갔다 하는 NPC를 놓는다.
  // drawLook: 겉모습을 그리는 함수 (예: studentLooks.js의 STUDENT_LOOKS[0])
  // 이렇게 놓은 NPC(학생)는 가까이 온 구구를 쫓아내기로 튕겨 낸다.
  addNpc(path, speed, drawLook) {
    const npc = new Npc(this, path, speed, drawLook);
    npc.onShoo = () => {
      this.gugu.knockback(npc.sprite.x, npc.sprite.y);
      this.showMessage('휙! 쫓겨났다');
    };
    this.npcs.push(npc);
    this.students.push(npc);
  }

  // 청소 미화원을 놓는다. 빗자루에 맞으면 경계 게이지에 따라 튕겨 나가거나 발각된다.
  addJanitor(path, speed) {
    const janitor = new Janitor(this, path, speed, this.gugu.sprite);
    janitor.onBroomHit = () => {
      if (this.hitByHazard(janitor.sprite.x, janitor.sprite.y)) {
        this.caught('빗자루에 쓸려 캠퍼스 밖으로 방생되었다...');
      } else {
        this.showMessage('휙! 빗자루에 쓸렸다');
      }
    };
    this.npcs.push(janitor);
  }

  // '구구' 울음소리: 구구 위에 말풍선을 띄우고, 가까운 학생이 잠시 소리 난 곳을 보게 한다.
  coo(x, y) {
    const bubble = this.add.text(x, y - 36, '구구!', {
      ...TEXT.small,
      backgroundColor: CSS_COLORS.cream,
      padding: { x: 6, y: 2 },
    }).setOrigin(0.5).setDepth(50);
    this.time.delayedCall(COO_BUBBLE_MS, () => bubble.destroy());

    this.students
      .filter((s) => Phaser.Math.Distance.Between(x, y, s.sprite.x, s.sprite.y) <= COO_RANGE)
      .forEach((s) => s.distract(x, y));
  }

  // 출입문을 놓는다. 열린 뒤 구구가 닿으면 클리어 화면을 거쳐 nextSceneKey 스테이지로 이동한다.
  addDoor(x, y, width, height, nextSceneKey) {
    const door = new Door(this, x, y, width, height);
    this.physics.add.overlap(this.gugu.sprite, door.sprite, () => {
      if (door.isOpen) this.clearStage(nextSceneKey);
    });
    return door;
  }

  // 비밀번호 키패드를 놓는다. Enter로 쪼면 입력 화면이 열린다.
  // code: 정답 4자리 문자열, onSuccess: 맞혔을 때 실행할 함수
  addKeypad(x, y, code, onSuccess) {
    drawKeypad(this, x, y);
    this.peckables.push({ x, y, onPeck: () => this.keypadPanel.open(code, onSuccess) });
  }

  // 구구 가까이에 있는 물건 하나를 쫀다.
  // 물건에 area({ x, y, width, height })가 있으면 그 사각형 둘레 PECK_RANGE 안에서 쫄 수 있다.
  handlePeck(x, y) {
    const target = this.peckables.find((p) => {
      if (!p.area) return Phaser.Math.Distance.Between(x, y, p.x, p.y) <= PECK_RANGE;
      const { area: a } = p;
      return Math.abs(x - a.x) <= a.width / 2 + PECK_RANGE && Math.abs(y - a.y) <= a.height / 2 + PECK_RANGE;
    });
    if (target) target.onPeck();
  }

  // 바닥에 보이는 단서를 놓는다. 구구가 닿으면 사라지고 자세히 보기 창이 열린다.
  addClue(x, y, clue) {
    if (notebook.has(clue.id)) return;
    const item = new Clue(this, x, y, clue);
    this.physics.add.overlap(this.gugu.sprite, item.sprite, () => {
      item.destroy();
      this.inspect(clue);
    });
  }

  // 가까이 가서 쪼면 살펴볼 수 있는 물건(게시판 · 칠판 등)이나, 밑 · 안에 단서가 숨겨진 물건(벤치 · 소파 등).
  // area: 물건의 사각형 { x, y, width, height }. 몇 번이든 다시 쪼아 볼 수 있다.
  addInspectable(area, clue) {
    this.peckables.push({ area, onPeck: () => this.inspect(clue) });
  }

  // 자세히 보기 창을 열고, 처음 본 단서는 수첩에 자동으로 저장한다.
  // (창을 닫기 전에 발각되어도 남도록 열 때 저장한다)
  inspect(clue) {
    const isNew = !notebook.has(clue.id);
    notebook.add(clue);
    this.notebookPanel.refresh();
    this.inspectPanel.open(clue, () => {
      if (isNew) this.showMessage(`수첩에 저장: ${clue.name}`);
    });
  }

  // 아이템 · 출입 권한을 얻는다.
  giveItem(item) {
    inventory.add(item);
    this.stageItems.push(item);
    this.showMessage(`획득: ${item.name}`);
  }

  showMessage(text) {
    const message = this.add.text(20, 56, text, TEXT.normal).setDepth(100);
    this.time.delayedCall(1500, () => message.destroy());
  }
}
