import StageScene from './StageScene.js';
import { STUDENT_LOOKS } from '../objects/studentLooks.js';
import { STAGE01_CLUES } from '../data/story.js';
import { drawBench, drawSign, drawTrashCan } from '../objects/props.js';
import { drawBuilding, drawGate, drawPlaza, drawWalkway } from '../objects/campus.js';
import { TEXT } from '../ui/style.js';

// design.md에 따라 둥근 도형과 진남색 외곽선, 작은 글씨 이름표로 그린다.
const LABEL_STYLE = TEXT.small;
const BENCH = { x: 1000, y: 180, width: 100, height: 36 }; // 밑에 일기장 (문제)
const TRASH_CAN = { x: 500, y: 300, width: 36, height: 36 }; // 안에 힌트 쪽지
const SIGN = { x: 950, y: 520, width: 120, height: 40 }; // 정문 안내판 (이야기)

export default class Stage01Scene extends StageScene {
  constructor() {
    super('Stage01Scene', { number: '01', name: '정문 & 향학로' });
  }

  create() {
    this.drawCampus();
    this.drawProps();
    super.create();

    // 일기장 줄마다 첫 글자를 세로로 읽으면 키패드 비밀번호(삼팔이구 → 3829)가 된다 (story.js).
    this.addClue(400, 500, STAGE01_CLUES.news); // 바닥의 신문 조각: 일기장이 벤치 밑에 있다 (닿으면 줍기)
    this.addInspectable(BENCH, STAGE01_CLUES.diary); // 벤치 밑 일기장: 문제 (쪼면 찾기)
    this.addInspectable(TRASH_CAN, STAGE01_CLUES.trash); // 쓰레기통 쪽지: 힌트 (쪼면 찾기)
    this.addInspectable(SIGN, STAGE01_CLUES.sign); // 정문 안내판: 이야기 (쪼면 자세히 보기)

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

  // 바닥 길과 디자인용 건물 (충돌 없음). 왼쪽 정문(사향문)에서 오른쪽 학생회관 출입문까지 향학로가 이어진다.
  // 실제 서울교대처럼 정문을 들어서면 왼쪽(위)에 미술2관, 오른쪽(아래)에 사향융합체육관이 있다.
  drawCampus() {
    const ROAD = { x: 640, y: 360, width: 1280, height: 70 };
    drawWalkway(this, ROAD);
    drawWalkway(this, { x: BENCH.x, y: 262, width: 44, height: 126 }); // 향학로 → 벤치
    drawWalkway(this, { x: SIGN.x, y: 447, width: 44, height: 104 }); // 향학로 → 정문 안내판
    drawPlaza(this, 640, ROAD.y, 90);
    this.add.text(760, ROAD.y + ROAD.height / 2 + 12, '향학로', LABEL_STYLE).setOrigin(0.5).setDepth(-5);

    drawGate(this, 30, ROAD.y, ROAD.height, '사향문 (정문)');
    drawBuilding(this, { x: 135, y: 175, width: 210, height: 150, name: '미술2관', sub: '다솜채 cafe' });
    drawBuilding(this, { x: 140, y: 590, width: 220, height: 180, name: '사향융합체육관' });
    // 학생회관: 향학로 끝 출입문 위아래의 두 동
    drawBuilding(this, { x: 1215, y: 245, width: 130, height: 130, name: '학생회관', sub: '편의점 · 구내식당' });
    drawBuilding(this, { x: 1215, y: 475, width: 130, height: 130, name: '학생회관', sub: '동아리방' });
  }

  // 벤치 · 쓰레기통 · 정문 안내판
  drawProps() {
    const b = BENCH;
    drawBench(this, b.x, b.y, b.width, b.height);
    this.add.text(b.x, b.y + 32, '벤치', LABEL_STYLE).setOrigin(0.5);

    const t = TRASH_CAN;
    drawTrashCan(this, t.x, t.y, t.width);
    this.add.text(t.x, t.y + 32, '쓰레기통', LABEL_STYLE).setOrigin(0.5);

    const s = SIGN;
    drawSign(this, s.x, s.y, s.width, s.height);
    this.add.text(s.x, s.y + 42, '정문 안내판', LABEL_STYLE).setOrigin(0.5);
  }
}
