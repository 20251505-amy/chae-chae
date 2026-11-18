import Gugu from '../objects/Gugu.js';
import Clue from '../objects/Clue.js';
import Npc from '../objects/Npc.js';
import Door from '../objects/Door.js';
import { notebook } from '../systems/notebook.js';
import { inventory } from '../systems/inventory.js';
import NotebookPanel from '../ui/NotebookPanel.js';
import KeypadPanel from '../ui/KeypadPanel.js';

const PECK_RANGE = 40; // 구구가 쪼을 수 있는 거리 (픽셀)
const CAUGHT_TIME = 1500; // 시야에 이만큼(ms) 계속 보이면 발각된다

// 모든 스테이지가 함께 쓰는 탑다운 장면의 바탕.
// 새 스테이지는 이 클래스를 상속하고 key와 스테이지 정보만 넘기면 된다.
export default class StageScene extends Phaser.Scene {
  constructor(key, stage) {
    super(key);
    // { number: '01', name: '정문 & 향학로', start?: { x, y }, startInVent?: true }
    // start가 없으면 화면 가운데에서 시작한다. startInVent이면 환풍구 안에서 날고 있는 상태로 시작한다.
    this.stage = stage;
  }

  create() {
    this.add.text(20, 20, `Stage ${this.stage.number}  ${this.stage.name}`, {
      fontSize: '24px',
      color: '#ffffff',
    });

    // 쪼을 수 있는 물건(스위치 · 키패드 등) 목록. 각 스테이지가 { x, y, onPeck() } 형태로 넣는다.
    this.peckables = [];
    this.npcs = [];
    this.exposure = 0; // 구구가 시야에 계속 보인 시간 (ms)

    // 체크포인트: 스테이지 시작 위치
    this.checkpoint = this.stage.start ?? { x: this.scale.width / 2, y: this.scale.height / 2 };
    this.gugu = new Gugu(this, this.checkpoint.x, this.checkpoint.y,
      (x, y) => this.handlePeck(x, y));
    if (this.stage.startInVent) this.gugu.enterVent();

    this.notebookPanel = new NotebookPanel(this);
    this.keypadPanel = new KeypadPanel(this);
    // 열려 있는 동안 구구가 멈추는 창 목록 (스테이지가 더 넣을 수 있다)
    this.panels = [this.keypadPanel];
  }

  update(time, delta) {
    const canAct = this.panels.every((p) => !p.isOpen && !p.justClosed);
    this.gugu.update(delta, canAct);
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

  // 발각되면 '캠퍼스 밖 방생' → 체크포인트(스테이지 시작 위치)로 돌아간다.
  // 주운 단서와 아이템은 그대로 남는다.
  caught(message = '발각! 캠퍼스 밖으로 방생되었다...') {
    this.panels.forEach((p) => { if (p.isOpen) p.close(); });
    this.showMessage(message);
    this.gugu.respawn(this.checkpoint.x, this.checkpoint.y);
    if (this.stage.startInVent) this.gugu.enterVent();
  }

  // 정해진 길(path)을 왔다 갔다 하는 NPC를 놓는다.
  addNpc(path, speed) {
    this.npcs.push(new Npc(this, path, speed));
  }

  // 출입문을 놓는다. 열린 뒤 구구가 닿으면 nextSceneKey 스테이지로 이동한다.
  addDoor(x, y, width, height, nextSceneKey) {
    const door = new Door(this, x, y, width, height);
    this.physics.add.overlap(this.gugu.sprite, door.sprite, () => {
      if (door.isOpen) this.scene.start(nextSceneKey);
    });
    return door;
  }

  // 비밀번호 키패드를 놓는다. Enter로 쪼면 입력 화면이 열린다.
  // code: 정답 4자리 문자열, onSuccess: 맞혔을 때 실행할 함수
  addKeypad(x, y, code, onSuccess) {
    this.add.rectangle(x, y, 28, 28, 0x555555).setStrokeStyle(2, 0xaaaaaa).setDepth(-1);
    this.peckables.push({ x, y, onPeck: () => this.keypadPanel.open(code, onSuccess) });
  }

  // 구구 가까이에 있는 물건 하나를 쫀다.
  handlePeck(x, y) {
    const target = this.peckables.find(
      (p) => Phaser.Math.Distance.Between(x, y, p.x, p.y) <= PECK_RANGE,
    );
    if (target) target.onPeck();
  }

  // 단서를 놓는다. 구구가 닿으면 수첩에 자동으로 저장되고 사라진다.
  addClue(x, y, clue) {
    if (notebook.has(clue.id)) return;
    const item = new Clue(this, x, y, clue);
    this.physics.add.overlap(this.gugu.sprite, item.sprite, () => {
      notebook.add(clue);
      item.destroy();
      this.notebookPanel.refresh();
      this.showMessage(`수첩에 저장: ${clue.name}`);
    });
  }

  // 아이템 · 출입 권한을 얻는다.
  giveItem(item) {
    inventory.add(item);
    this.showMessage(`획득: ${item.name}`);
  }

  showMessage(text) {
    const message = this.add.text(20, 56, text, { fontSize: '18px', color: '#ffe08a' });
    this.time.delayedCall(1500, () => message.destroy());
  }
}
