import StageScene from './StageScene.js';
import { STUDENT_LOOKS } from '../objects/studentLooks.js';
import { STAGE01_CLUES } from '../data/story.js';
import { COLORS, OUTLINE, TEXT } from '../ui/style.js';

// design.md에 따라 둥근 도형과 진남색 외곽선, 작은 글씨 이름표로 그린다.
const LABEL_STYLE = TEXT.small;
const BENCH = { x: 1000, y: 180, width: 90, height: 30 }; // 밑에 둘째 학보 조각
const TRASH_CAN = { x: 500, y: 300, width: 36, height: 36 }; // 안에 셋째 학보 조각
const SIGN = { x: 950, y: 520, width: 120, height: 40 }; // 정문 안내판, 구석 낙서에 넷째 숫자

export default class Stage01Scene extends StageScene {
  constructor() {
    super('Stage01Scene', { number: '01', name: '정문 & 향학로' });
  }

  create() {
    this.drawProps();
    super.create();

    // 학보 조각 4개를 서로 다른 방법으로 얻는다. 순서대로 이으면 키패드 비밀번호(3829)가 된다.
    this.addClue(400, 500, STAGE01_CLUES.paper1); // 바닥에 보이는 조각 (닿으면 줍기)
    this.addInspectable(BENCH, STAGE01_CLUES.paper2); // 벤치 밑 (쪼면 찾기)
    this.addInspectable(TRASH_CAN, STAGE01_CLUES.paper3); // 쓰레기통 안 (쪼면 찾기)
    this.addInspectable(SIGN, STAGE01_CLUES.sign); // 정문 안내판 (쪼면 자세히 보기)

    // 등교하는 학생 5명 (겉모습은 모두 다르다). 각자 단서나 키패드 바로 옆을 지나가며 왔다 갔다 한다.
    const speed = 100;
    this.addNpc([{ x: 300, y: 540 }, { x: 500, y: 540 }], speed, STUDENT_LOOKS[0]); // 첫째 조각 아래
    this.addNpc([{ x: 460, y: 200 }, { x: 460, y: 420 }], speed, STUDENT_LOOKS[1]); // 쓰레기통 왼쪽
    this.addNpc([{ x: 880, y: 140 }, { x: 1120, y: 140 }], speed, STUDENT_LOOKS[2]); // 벤치 위
    this.addNpc([{ x: 1010, y: 400 }, { x: 1010, y: 640 }], speed, STUDENT_LOOKS[3]); // 안내판 오른쪽
    this.addNpc([ // 키패드 둘레
      { x: 820, y: 240 }, { x: 980, y: 240 }, { x: 980, y: 360 }, { x: 820, y: 360 }, { x: 820, y: 240 },
    ], speed, STUDENT_LOOKS[4]);

    // 오른쪽 끝의 출입문. 키패드를 풀면 열리고, 닿으면 Stage 02로 이동한다.
    const door = this.addDoor(1265, 360, 20, 120, 'Stage02Scene');

    // 키패드. 맞히면 Stage 01 보상(비행 스태미나 기초 강화)을 얻고 출입문이 열린다.
    this.addKeypad(900, 300, '3829', () => {
      this.giveItem({ id: 'stamina-upgrade-1', name: '비행 스태미나 기초 강화' });
      door.open();
    });
  }

  // 벤치 · 쓰레기통 · 정문 안내판
  drawProps() {
    const b = BENCH;
    this.add.rectangle(b.x, b.y, b.width, b.height, COLORS.gray).setStrokeStyle(OUTLINE, COLORS.navy).setDepth(-2);
    this.add.text(b.x, b.y + 30, '벤치', LABEL_STYLE).setOrigin(0.5);

    const t = TRASH_CAN;
    this.add.circle(t.x, t.y, t.width / 2, COLORS.gray).setStrokeStyle(OUTLINE, COLORS.navy).setDepth(-2);
    this.add.text(t.x, t.y + 32, '쓰레기통', LABEL_STYLE).setOrigin(0.5);

    const s = SIGN;
    this.add.rectangle(s.x, s.y, s.width, s.height, COLORS.gray).setStrokeStyle(OUTLINE, COLORS.navy).setDepth(-2);
    this.add.text(s.x, s.y + 34, '정문 안내판', LABEL_STYLE).setOrigin(0.5);
  }
}
