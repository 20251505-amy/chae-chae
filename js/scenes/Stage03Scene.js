import StageScene from './StageScene.js';
import { STUDENT_LOOKS } from '../objects/studentLooks.js';
import { STAGE03_CLUES } from '../data/story.js';
import { drawChalkboard, drawClassDesk, drawLectern, drawWall } from '../objects/props.js';
import { drawDoorMat, drawWoodFloor } from '../objects/floors.js';
import { TEXT } from '../ui/style.js';

// 가구 그림은 props.js, 이름표는 design.md의 작은 글씨로 그린다.
const LABEL_STYLE = TEXT.small;
// 위쪽은 강의실, 아래쪽은 복도. 칠판은 오른쪽 위 UI(스태미나)와 겹치지 않게 가운데 왼쪽에 둔다.
const CHALKBOARD = { x: 560, y: 110, width: 360, height: 40 };
const LECTERN = { x: 560, y: 190, width: 120, height: 50 }; // 서랍에 힌트 쪽지
const DESK_SIZE = { width: 140, height: 34 };
const DESK_COLUMNS = [340, 560, 780];
const DESK_ROWS = [270, 340, 410];
const NOTEBOOK_DESK = { x: 780, y: 410, ...DESK_SIZE }; // 맨 뒷줄 오른쪽 책상 위 필기 노트
const WALL_Y = 490; // 강의실과 복도 사이 벽. 앞문 · 뒷문 자리로만 지나갈 수 있다 (날아도 막힌다)
const WALL_HEIGHT = 16;
const WALL_GAPS = [{ x: 150, label: '앞문' }, { x: 1000, label: '뒷문' }];
const GAP_WIDTH = 100;

// 문 자리를 비우고 남은 벽 조각들 { x, y, width, height } (가운데 기준)
function wallSegments(screenWidth) {
  const edges = [0, ...WALL_GAPS.flatMap((g) => [g.x - GAP_WIDTH / 2, g.x + GAP_WIDTH / 2]), screenWidth];
  const segments = [];
  for (let i = 0; i < edges.length; i += 2) {
    const [left, right] = [edges[i], edges[i + 1]];
    segments.push({ x: (left + right) / 2, y: WALL_Y, width: right - left, height: WALL_HEIGHT });
  }
  return segments;
}
const KEYPAD = { x: 1150, y: 560 };

export default class Stage03Scene extends StageScene {
  constructor() {
    super('Stage03Scene', {
      number: '03',
      name: '인문관 (강의실)',
      start: { x: 60, y: 610 }, // 왼쪽 복도
    });
  }

  create() {
    this.drawRoom();
    super.create();

    // 강의실 · 복도 사이 벽은 구구가 통과하지 못한다.
    const walls = this.physics.add.staticGroup();
    wallSegments(this.scale.width).forEach((w) => walls.add(this.add.rectangle(w.x, w.y, w.width, w.height).setVisible(false)));
    this.physics.add.collider(this.gugu.sprite, walls);

    // 높이 있는 것: 책상 9개, 교탁 (날아야 넘어가거나 올라설 수 있다)
    DESK_ROWS.forEach((y) => DESK_COLUMNS.forEach((x) => this.addObstacle({ x, y, ...DESK_SIZE })));
    this.addObstacle(LECTERN);

    // 칠판 빈칸(문제) · 필기 노트(답 정리) · 교탁 쪽지(푸는 순서)를 이으면 키패드 비밀번호(5486)가 된다 (story.js).
    // 모두 가까이 가서 쪼아야 살펴볼 수 있다.
    this.addInspectable(CHALKBOARD, STAGE03_CLUES.chalk);
    this.addInspectable(NOTEBOOK_DESK, STAGE03_CLUES.notebook);
    this.addInspectable(LECTERN, STAGE03_CLUES.lectern);

    // 강의실 학생 2명: 책상 둘레를 돌고, 책상 줄 사이 통로를 오간다.
    this.addNpc([
      { x: 240, y: 235 }, { x: 880, y: 235 }, { x: 880, y: 455 }, { x: 240, y: 455 }, { x: 240, y: 235 },
    ], 100, STUDENT_LOOKS[2]);
    this.addNpc([{ x: 450, y: 250 }, { x: 450, y: 460 }], 100, STUDENT_LOOKS[4]);

    // 쉬는 시간 복도 인파: 학생 6명이 속도를 달리해 좌우로 오가며 틈이 생겼다 사라졌다 한다.
    const crowd = [
      [{ x: 150, y: 545 }, { x: 650, y: 545 }, 120],
      [{ x: 250, y: 675 }, { x: 850, y: 675 }, 90],
      [{ x: 450, y: 610 }, { x: 950, y: 610 }, 110],
      [{ x: 700, y: 545 }, { x: 1050, y: 545 }, 80],
      [{ x: 900, y: 675 }, { x: 1200, y: 675 }, 100],
      [{ x: 1100, y: 530 }, { x: 1100, y: 690 }, 100], // 키패드 앞
    ];
    crowd.forEach(([from, to, speed], i) => this.addNpc([from, to], speed, STUDENT_LOOKS[i % STUDENT_LOOKS.length]));

    // 오른쪽 끝의 출입문. 키패드를 풀면 열리고, 닿으면 다음 스테이지로 이동한다.
    // Stage 04~09를 만들기 전까지는 Stage 10으로 이동한다.
    const door = this.addDoor(1265, 610, 20, 120, 'Stage10Scene');

    // 강의실 키패드. 맞히면 학술정보관 열람실 패스를 얻고 출입문이 열린다.
    this.addKeypad(KEYPAD.x, KEYPAD.y, '5486', () => {
      this.giveItem({ id: 'library-pass', name: '학술정보관 열람실 패스' });
      door.open();
    });
  }

  // 방 배치: 위쪽 벽 칠판, 그 앞 교탁, 책상 3줄 / 벽 / 아래쪽 복도, 오른쪽 아래 키패드와 출입문
  drawRoom() {
    // 바닥: 나무 마루, 출입문 앞 매트 (floors.js)
    drawWoodFloor(this);
    drawDoorMat(this, { x: 1225, y: 610, width: 60, height: 110 });

    // 강의실과 복도 사이 벽 (앞문 · 뒷문 자리는 비워 둔다)
    wallSegments(this.scale.width).forEach((w) => drawWall(this, w));
    WALL_GAPS.forEach((g) => this.add.text(g.x, WALL_Y, g.label, LABEL_STYLE).setOrigin(0.5));
    this.add.text(640, 700, '복도', LABEL_STYLE).setOrigin(0.5);

    const c = CHALKBOARD;
    drawChalkboard(this, c.x, c.y, c.width, c.height);
    this.add.text(c.x, c.y - c.height / 2 - 14, '칠판', LABEL_STYLE).setOrigin(0.5);

    const l = LECTERN;
    drawLectern(this, l.x, l.y, l.width, l.height);
    this.add.text(l.x + l.width / 2 + 24, l.y, '교탁', LABEL_STYLE).setOrigin(0.5);

    DESK_ROWS.forEach((y) => DESK_COLUMNS.forEach((x) => {
      const notebook = x === NOTEBOOK_DESK.x && y === NOTEBOOK_DESK.y;
      drawClassDesk(this, x, y, DESK_SIZE.width, DESK_SIZE.height, { notebook });
    }));

    this.add.text(KEYPAD.x, KEYPAD.y - 34, '강의실 키패드', LABEL_STYLE).setOrigin(0.5);
  }
}
