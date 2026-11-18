import StageScene from './StageScene.js';

export default class Stage01Scene extends StageScene {
  constructor() {
    super('Stage01Scene', { number: '01', name: '정문 & 향학로' });
  }

  create() {
    super.create();

    // 떨어진 학보 조각 4개. 조각의 숫자를 순서대로 이으면 키패드 비밀번호(3829)가 된다.
    this.addClue(400, 500, { id: 'stage01-paper-1', name: '학보 조각 (첫째 자리): 3' });
    this.addClue(1000, 180, { id: 'stage01-paper-2', name: '학보 조각 (둘째 자리): 8' });
    this.addClue(500, 300, { id: 'stage01-paper-3', name: '학보 조각 (셋째 자리): 2' });
    this.addClue(950, 520, { id: 'stage01-paper-4', name: '학보 조각 (넷째 자리): 9' });

    // 등교하는 학생 5명. 각자 단서나 키패드 바로 옆을 지나가며 왔다 갔다 한다.
    const speed = 100;
    this.addNpc([{ x: 300, y: 540 }, { x: 500, y: 540 }], speed); // 첫째 조각 아래
    this.addNpc([{ x: 460, y: 200 }, { x: 460, y: 420 }], speed); // 셋째 조각 왼쪽
    this.addNpc([{ x: 880, y: 140 }, { x: 1120, y: 140 }], speed); // 둘째 조각 위
    this.addNpc([{ x: 1010, y: 400 }, { x: 1010, y: 640 }], speed); // 넷째 조각 오른쪽
    this.addNpc([ // 키패드 둘레
      { x: 820, y: 240 }, { x: 980, y: 240 }, { x: 980, y: 360 }, { x: 820, y: 360 }, { x: 820, y: 240 },
    ], speed);

    // 오른쪽 끝의 출입문. 키패드를 풀면 열리고, 닿으면 Stage 10으로 이동한다. (MVP)
    const door = this.addDoor(1265, 360, 20, 120, 'Stage10Scene');

    // 키패드. 맞히면 Stage 01 보상(비행 스태미나 기초 강화)을 얻고 출입문이 열린다.
    this.addKeypad(900, 300, '3829', () => {
      this.giveItem({ id: 'stamina-upgrade-1', name: '비행 스태미나 기초 강화' });
      door.open();
    });
  }
}
