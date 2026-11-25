import StageScene from './StageScene.js';
import { STUDENT_LOOKS } from '../objects/studentLooks.js';
import { STAGE02_CLUES } from '../data/story.js';
import { drawBulletinBoard, drawChalkboard, drawDesk, drawSofa } from '../objects/props.js';
import { drawDoorMat, drawRug, drawWoodFloor } from '../objects/floors.js';
import { TEXT } from '../ui/style.js';

// 가구 그림은 props.js, 이름표는 design.md의 작은 글씨로 그린다.
const LABEL_STYLE = TEXT.small;
// 게시판 · 칠판은 오른쪽 위 UI(스태미나 · 경계 게이지)와 겹치지 않게 조금 아래에 둔다.
const BOARD = { x: 380, y: 110, width: 320, height: 40 }; // 동아리 게시판
const CHALKBOARD = { x: 800, y: 110, width: 240, height: 40 };
const DESK = { x: 640, y: 350, width: 220, height: 100 };
const SOFA = { x: 420, y: 600, width: 200, height: 60 };
const KEYPAD = { x: 1090, y: 570 };

export default class Stage02Scene extends StageScene {
  constructor() {
    super('Stage02Scene', {
      number: '02',
      name: '학생회관 (동아리방)',
      start: { x: 90, y: 360 },
      alertGauge: true, // 미화원 빗자루가 있어 경계 게이지를 쓴다
    });
  }

  create() {
    this.drawRoom();
    super.create();

    // 게시판(시간표) · 칠판(낙서가 소파를 가리킴) · 소파 밑 쪽지(비번 규칙)를 이으면 키패드 비밀번호(1821)가 된다.
    // 모두 가까이 가서 쪼아야 살펴볼 수 있다.
    this.addInspectable(BOARD, STAGE02_CLUES.board);
    this.addInspectable(CHALKBOARD, STAGE02_CLUES.chalk);
    this.addInspectable(SOFA, STAGE02_CLUES.sofa);

    // 청소 미화원: 책상 둘레 복도를 돌며 3초마다 빗자루를 휘두른다.
    this.addJanitor([
      { x: 260, y: 270 }, { x: 1020, y: 270 }, { x: 1020, y: 450 }, { x: 260, y: 450 }, { x: 260, y: 270 },
    ], 80);

    // 동아리방 학생 3명: 게시판 앞, 칠판 앞, 키패드 둘레
    const speed = 100;
    this.addNpc([{ x: 230, y: 210 }, { x: 550, y: 210 }], speed, STUDENT_LOOKS[1]);
    this.addNpc([{ x: 690, y: 210 }, { x: 910, y: 210 }], speed, STUDENT_LOOKS[3]);
    this.addNpc([
      { x: 990, y: 510 }, { x: 1190, y: 510 }, { x: 1190, y: 640 }, { x: 990, y: 640 }, { x: 990, y: 510 },
    ], speed, STUDENT_LOOKS[0]);

    // 오른쪽 끝의 출입문. 키패드를 풀면 열리고, 닿으면 다음 스테이지로 이동한다.
    // Stage 03~09를 만들기 전까지는 Stage 10으로 이동한다.
    const door = this.addDoor(1265, 360, 20, 120, 'Stage10Scene');

    // 연극부 방 키패드. 맞히면 학생증을 얻고 출입문이 열린다.
    this.addKeypad(KEYPAD.x, KEYPAD.y, '1821', () => {
      this.giveItem({ id: 'student-card', name: '학생증 (1차 출입 카드)' });
      door.open();
    });
  }

  // 방 배치: 위쪽 벽 게시판, 그 오른쪽 칠판, 가운데 책상, 아래쪽 소파, 오른쪽 아래 키패드
  drawRoom() {
    // 바닥: 나무 마루, 책상 아래 러그, 출입문 앞 매트 (floors.js)
    drawWoodFloor(this);
    drawRug(this, { x: DESK.x, y: DESK.y, width: 300, height: 170 });
    drawDoorMat(this, { x: 1225, y: 360, width: 60, height: 110 });

    const furniture = [
      [BOARD, '동아리 게시판', -1, drawBulletinBoard],
      [CHALKBOARD, '칠판', -1, drawChalkboard],
      [DESK, '책상', 1, drawDesk],
      [SOFA, '소파', 1, drawSofa],
    ];
    furniture.forEach(([f, label, side, draw]) => {
      draw(this, f.x, f.y, f.width, f.height);
      this.add.text(f.x, f.y + side * (f.height / 2 + 14), label, LABEL_STYLE).setOrigin(0.5);
    });
    this.add.text(KEYPAD.x, KEYPAD.y + 30, '연극부 방 키패드', LABEL_STYLE).setOrigin(0.5);
  }
}
