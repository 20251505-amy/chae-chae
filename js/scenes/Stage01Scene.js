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

    // 등교하는 학생 5명. 각자 정해진 길을 왔다 갔다 한다.
    this.addNpc([{ x: 150, y: 150 }, { x: 600, y: 150 }]);
    this.addNpc([{ x: 1150, y: 120 }, { x: 1150, y: 600 }]);
    this.addNpc([{ x: 200, y: 640 }, { x: 900, y: 640 }]);
    this.addNpc([{ x: 750, y: 200 }, { x: 750, y: 520 }]);
    this.addNpc([{ x: 250, y: 280 }, { x: 250, y: 560 }]);

    // 오른쪽 끝의 출입문. 키패드를 풀면 열리고, 닿으면 Stage 10으로 이동한다. (MVP)
    const door = this.addDoor(1265, 360, 20, 120, 'Stage10Scene');

    // 키패드. 맞히면 Stage 01 보상(비행 스태미나 기초 강화)을 얻고 출입문이 열린다.
    this.addKeypad(900, 300, '3829', () => {
      this.giveItem({ id: 'stamina-upgrade-1', name: '비행 스태미나 기초 강화' });
      door.open();
    });
  }
}
