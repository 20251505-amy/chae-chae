// 스테이지에 놓는 물건들의 그림. 위에서 내려다본 귀여운 카툰 모양으로 그린다.
// design.md: 5가지 색만 쓰고, 모든 물건에 진남색 외곽선 3px. 가구 · 벽 같은 배경 사물은 회색이 바탕이다.
// 함수마다 (x, y)를 가운데로 하는 Graphics 하나를 돌려준다. 충돌 · 쪼기 판정은 장면이 따로 맡는다.
import { COLORS, OUTLINE } from '../ui/style.js';

const { navy, gray, cream, yellow, red } = COLORS;

function create(scene, x, y, depth = -2) {
  return scene.add.graphics({ x, y }).setDepth(depth);
}

function box(g, x, y, w, h, fill, radius = 4, line = OUTLINE) {
  g.fillStyle(fill);
  g.fillRoundedRect(x, y, w, h, radius);
  g.lineStyle(line, navy);
  g.strokeRoundedRect(x, y, w, h, radius);
}

function dot(g, x, y, r, fill, line = 0) {
  g.fillStyle(fill);
  g.fillCircle(x, y, r);
  if (line) {
    g.lineStyle(line, navy);
    g.strokeCircle(x, y, r);
  }
}

// 공원 벤치: 나무 판자 세 줄과 양 끝의 진남색 팔걸이
export function drawBench(scene, x, y, width, height) {
  const g = create(scene, x, y);
  const slatH = (height - 8) / 3;
  for (let i = 0; i < 3; i += 1) {
    box(g, -width / 2 + 6, -height / 2 + 2 + i * (slatH + 2), width - 12, slatH, gray, 3, 2);
  }
  [-1, 1].forEach((side) => box(g, side * (width / 2 - 5) - 5, -height / 2 - 3, 10, height + 6, navy, 3));
  return g;
}

// 둥근 쓰레기통: 테두리 · 어두운 안쪽 · 구겨진 종이 뭉치 · 양옆 손잡이
export function drawTrashCan(scene, x, y, size) {
  const g = create(scene, x, y);
  const r = size / 2;
  [-1, 1].forEach((side) => box(g, side * (r + 1) - 4, -5, 8, 10, gray, 2, 2));
  dot(g, 0, 0, r, gray, OUTLINE);
  g.fillStyle(navy, 0.35);
  g.fillCircle(0, 0, r - 6);
  dot(g, -4, -3, 6, cream, 2);
  dot(g, 5, 4, 5, cream, 2);
  return g;
}

// 정문 안내판: 기둥 두 개 위의 회색 판, 안쪽 크림색 면에 글줄과 노란 학교 표시
export function drawSign(scene, x, y, width, height) {
  const g = create(scene, x, y);
  [-1, 1].forEach((side) => box(g, side * (width / 2 - 18) - 4, height / 2 - 6, 8, 16, navy, 2));
  box(g, -width / 2, -height / 2, width, height, gray, 6);
  box(g, -width / 2 + 6, -height / 2 + 6, width - 12, height - 12, cream, 3, 2);
  dot(g, -width / 2 + 20, 0, 7, yellow, 2);
  g.lineStyle(3, navy);
  [-6, 0, 6].forEach((dy, i) => g.lineBetween(-width / 2 + 34, dy, width / 2 - 14 - i * 14, dy));
  return g;
}

// 비밀번호 키패드: 작은 화면 · 버튼 3×3 · 노란 불빛
export function drawKeypad(scene, x, y) {
  const g = create(scene, x, y, -1);
  box(g, -15, -19, 30, 38, gray, 5);
  box(g, -10, -14, 20, 7, cream, 2, 2);
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) dot(g, -7 + col * 7, 1 + row * 6, 2, navy);
  }
  dot(g, 10, -10.5, 2.5, yellow);
  return g;
}

// 출입문: 문틀 안의 문짝과 손잡이. 잠기면 회색, 열리면 노랑.
export function drawDoor(g, width, height, isOpen) {
  g.clear();
  box(g, -width / 2 - 3, -height / 2 - 6, width + 6, height + 12, navy, 3);
  box(g, -width / 2, -height / 2, width, height, isOpen ? yellow : gray, 2, 2);
  g.lineStyle(2, navy);
  g.strokeRect(-width / 2 + 4, -height / 2 + 8, width - 8, height / 2 - 14);
  g.strokeRect(-width / 2 + 4, 6, width - 8, height / 2 - 14);
  dot(g, -width / 2 + 5, 0, 3, cream, 2);
}

// 바닥에 떨어진 신문 조각: 노란 종이에 제목 줄과 글줄, 접힌 자국
export function drawPaperScrap(scene, x, y) {
  const g = create(scene, x, y, -1);
  g.fillStyle(yellow);
  g.lineStyle(OUTLINE, navy);
  const points = [{ x: -14, y: -10 }, { x: 12, y: -12 }, { x: 15, y: 9 }, { x: -12, y: 12 }];
  g.fillPoints(points, true);
  g.strokePoints(points, true);
  g.lineStyle(3, navy);
  g.lineBetween(-9, -5, 8, -6);
  g.lineStyle(1.5, navy);
  g.lineBetween(-9, 1, 9, 0);
  g.lineBetween(-8, 6, 6, 5);
  return g;
}

// 책상: 회색 상판에 테두리 줄, 서류 몇 장과 연필꽂이
export function drawDesk(scene, x, y, width, height, { papers = true } = {}) {
  const g = create(scene, x, y);
  box(g, -width / 2, -height / 2, width, height, gray, 8);
  g.lineStyle(2, navy, 0.35);
  g.strokeRoundedRect(-width / 2 + 8, -height / 2 + 8, width - 16, height - 16, 4);
  if (papers) {
    box(g, width / 2 - 70, -height / 2 + 14, 40, 30, cream, 2, 2);
    box(g, width / 2 - 62, -height / 2 + 20, 40, 30, cream, 2, 2);
  }
  dot(g, width / 2 - 20, height / 2 - 20, 9, navy, 0);
  dot(g, width / 2 - 22, height / 2 - 22, 2, cream);
  dot(g, width / 2 - 17, height / 2 - 18, 2, yellow);
  return g;
}

// 소파: 위쪽 등받이, 양옆 팔걸이, 방석 두 개와 크림색 쿠션
export function drawSofa(scene, x, y, width, height) {
  const g = create(scene, x, y);
  const back = height * 0.32;
  const arm = 22;
  box(g, -width / 2, -height / 2, width, back + 6, gray, 8);
  [-1, 1].forEach((side) => box(g, side > 0 ? width / 2 - arm : -width / 2, -height / 2 + 4, arm, height - 4, gray, 8));
  const seatW = (width - arm * 2) / 2;
  [0, 1].forEach((i) => box(g, -width / 2 + arm + i * seatW, -height / 2 + back, seatW, height - back, gray, 6, 2));
  box(g, -width / 2 + arm + 8, -height / 2 + back + 4, 26, 18, cream, 6, 2);
  return g;
}

// 동아리 게시판: 회색 테두리 안 크림색 판에 붙은 종이들과 빨간 압정
export function drawBulletinBoard(scene, x, y, width, height) {
  const g = create(scene, x, y);
  box(g, -width / 2, -height / 2, width, height, gray, 4);
  box(g, -width / 2 + 5, -height / 2 + 5, width - 10, height - 10, cream, 2, 2);
  const count = Math.floor(width / 50);
  for (let i = 0; i < count; i += 1) {
    const px = -width / 2 + 14 + i * ((width - 28) / count);
    const tall = i % 2 === 0;
    box(g, px, -height / 2 + 9, 32, tall ? height - 18 : height - 24, i % 3 === 1 ? yellow : cream, 1, 2);
    dot(g, px + 16, -height / 2 + 11, 3, red);
  }
  return g;
}

// 칠판: 회색 테두리 안 진남색 판, 크림색 낙서 줄, 아래 분필 받침
export function drawChalkboard(scene, x, y, width, height) {
  const g = create(scene, x, y);
  box(g, -width / 2, -height / 2, width, height, gray, 4);
  g.fillStyle(navy);
  g.fillRect(-width / 2 + 5, -height / 2 + 5, width - 10, height - 14);
  g.lineStyle(2, cream);
  g.lineBetween(-width / 2 + 16, -8, -width / 2 + 90, -8);
  g.lineBetween(-width / 2 + 16, 2, -width / 2 + 130, 2);
  g.strokeCircle(width / 2 - 40, -3, 7);
  g.lineBetween(width / 2 - 70, -3, width / 2 - 52, -3);
  box(g, -width / 2 + 30, height / 2 - 8, 16, 5, cream, 2, 1);
  return g;
}

// 천장 환풍구: 회색 틀에 진남색 살, 네 귀퉁이 나사
export function drawVent(scene, x, y, width, height) {
  const g = create(scene, x, y);
  box(g, -width / 2, -height / 2, width, height, gray, 4);
  g.fillStyle(navy, 0.35);
  g.fillRect(-width / 2 + 8, -height / 2 + 8, width - 16, height - 16);
  g.lineStyle(3, navy);
  for (let ly = -height / 2 + 13; ly < height / 2 - 8; ly += 7) g.lineBetween(-width / 2 + 10, ly, width / 2 - 10, ly);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => dot(g, sx * (width / 2 - 4), sy * (height / 2 - 4), 2, cream));
  return g;
}

// 새우깡 봉지: 위아래가 톱니 모양으로 접힌 노란 봉지, 가운데 크림색 그림 칸에 과자 두 개
export function drawSnackBag(scene, x, y, width, height) {
  const g = create(scene, x, y, -1);
  const w = width / 2;
  const h = height / 2;
  const teeth = 5;
  const points = [];
  for (let i = 0; i <= teeth * 2; i += 1) points.push({ x: -w + (i * width) / (teeth * 2), y: -h + (i % 2) * 3 });
  for (let i = teeth * 2; i >= 0; i -= 1) points.push({ x: -w + (i * width) / (teeth * 2), y: h - (i % 2) * 3 });
  g.fillStyle(yellow);
  g.fillPoints(points, true);
  g.lineStyle(OUTLINE, navy);
  g.strokePoints(points, true);
  g.fillStyle(cream);
  g.fillEllipse(0, 1, width * 0.6, height * 0.5);
  g.lineStyle(2, navy);
  g.strokeEllipse(0, 1, width * 0.6, height * 0.5);
  [-4, 4].forEach((dx) => {
    g.beginPath();
    g.arc(dx, 3, 3.5, Math.PI, 0);
    g.strokePath();
  });
  return g;
}

// 발코니 창문: 회색 창틀 안 크림색 유리 세 칸, 유리에 비친 빛줄기
export function drawWindow(scene, x, y, width, height) {
  const g = create(scene, x, y);
  box(g, -width / 2, -height / 2, width, height, gray, 3);
  const pane = (height - 16) / 3;
  for (let i = 0; i < 3; i += 1) {
    const py = -height / 2 + 4 + i * (pane + 4);
    box(g, -width / 2 + 4, py, width - 8, pane, cream, 1, 2);
    g.lineStyle(2, gray);
    g.lineBetween(-width / 2 + 7, py + pane - 10, width / 2 - 7, py + 10);
  }
  return g;
}

// 책상 위 액자: 회색 테 안의 사진 (사람은 진남색, 비둘기는 회색)
export function drawPhotoFrame(scene, x, y, width, height) {
  const g = create(scene, x, y, -1);
  box(g, -width / 2, -height / 2, width, height, gray, 2);
  box(g, -width / 2 + 4, -height / 2 + 4, width - 8, height - 8, cream, 1, 1);
  dot(g, -4, 0, 4, navy);
  dot(g, 5, 2, 3, gray);
  return g;
}

// 교탁: 회색 상판과 안쪽 테두리 줄, 크림색 출석부, 분필 통
export function drawLectern(scene, x, y, width, height) {
  const g = create(scene, x, y);
  box(g, -width / 2, -height / 2, width, height, gray, 6);
  g.lineStyle(2, navy, 0.35);
  g.strokeRoundedRect(-width / 2 + 6, -height / 2 + 6, width - 12, height - 12, 3);
  box(g, -width / 2 + 14, -height / 2 + 10, 34, height - 20, cream, 2, 2);
  g.lineStyle(2, navy);
  g.lineBetween(-width / 2 + 31, -height / 2 + 12, -width / 2 + 31, height / 2 - 12);
  box(g, width / 2 - 34, -8, 20, 16, navy, 3, 2);
  [-29, -24, -19].forEach((cx) => dot(g, width / 2 + cx + 4, 0, 2, cream));
  return g;
}

// 강의실 책상: 긴 회색 상판, 아래(뒤)쪽에 진남색 의자 두 개. notebook이면 위에 노란 필기 노트를 펼쳐 둔다.
export function drawClassDesk(scene, x, y, width, height, { notebook = false } = {}) {
  const g = create(scene, x, y);
  [-1, 1].forEach((side) => {
    box(g, side * width / 4 - 14, height / 2 - 2, 28, 18, gray, 6, 2);
    box(g, side * width / 4 - 14, height / 2 + 12, 28, 6, navy, 3, 1);
  });
  box(g, -width / 2, -height / 2, width, height, gray, 5);
  g.lineStyle(2, navy, 0.35);
  g.lineBetween(-width / 2 + 8, height / 2 - 7, width / 2 - 8, height / 2 - 7);
  if (notebook) {
    box(g, -26, -height / 2 + 6, 52, height - 14, yellow, 2, 2);
    g.lineStyle(2, navy);
    g.lineBetween(0, -height / 2 + 6, 0, height / 2 - 8);
    g.lineStyle(1.5, navy, 0.6);
    [-6, 0, 6].forEach((dy) => {
      g.lineBetween(-21, dy, -5, dy);
      g.lineBetween(5, dy, 21, dy);
    });
  }
  return g;
}

// 칸막이 벽: 회색 벽돌 띠에 진남색 외곽선 (rect는 가운데 기준)
export function drawWall(scene, rect) {
  const g = create(scene, rect.x, rect.y);
  const { width: w, height: h } = rect;
  box(g, -w / 2, -h / 2, w, h, gray, 3);
  g.lineStyle(2, navy, 0.35);
  for (let bx = -w / 2 + 40; bx < w / 2; bx += 40) g.lineBetween(bx, -h / 2 + 3, bx, h / 2 - 3);
  return g;
}
