// 자세히 보기 창 안의 종이를 단서 종류(style)마다 다르게 그린다.
// design.md의 5가지 색 · 진남색 외곽선 3px만 쓰고, 모든 좌표는 종이 칸 가운데(0, 0) 기준이다.
//
// 단서의 style과 쓰는 값:
//   newspaper: masthead, date, headline(줄바꿈 \n), article   — 신문 조각 (비둘기 사진 포함)
//   diary:     date, lines[]                                  — 줄 쳐진 일기장 (한 줄에 한 문장)
//   note:      text                                           — 테이프 붙은 쪽지
//   sign:      heading, lines[]                               — 회색 안내판
//   chalk:     lines[]                                        — 진남색 칠판 + 소파를 가리키는 화살표
//   poster:    sheetLines[], heading, clocks[[시, 분]...], clockLabels[], footer — 코르크 게시판
//   photo:     back                                           — 액자 속 사진 (학생과 비둘기)
import Gugu from '../objects/Gugu.js';
import { COLORS, CSS_COLORS, OUTLINE, TEXT } from './style.js';

export const PAPER_WIDTH = 804;
export const PAPER_HEIGHT = 340;

const W = PAPER_WIDTH;
const H = PAPER_HEIGHT;

// 단서를 그린 게임 오브젝트 목록을 돌려준다. 자세히 보기 창이 컨테이너에 넣는다.
export function drawPaper(scene, clue) {
  return (STYLES[clue.style] ?? drawNote)(scene, clue);
}

const STYLES = {
  newspaper: drawNewspaper,
  diary: drawDiary,
  note: drawNote,
  sign: drawSign,
  chalk: drawChalk,
  poster: drawPoster,
  photo: drawPhoto,
};

function sheet(scene, x, y, w, h, color) {
  return scene.add.rectangle(x, y, w, h, color).setStrokeStyle(OUTLINE, COLORS.navy);
}

// 목에 하얀 점이 있는 비둘기 (구구와 같은 그림)
function pigeon(scene, x, y, scale) {
  const g = scene.add.graphics();
  Gugu.drawLook(g, COLORS.gray);
  g.fillStyle(COLORS.cream);
  g.fillCircle(7, 0, 3.5);
  return scene.add.container(x, y, [g]).setScale(scale).setRotation(-Math.PI / 2);
}

// 신문 조각: 제호 · 날짜, 굵은 속보 제목, 왼쪽 비둘기 사진, 오른쪽 기사
function drawNewspaper(scene, clue) {
  const left = -W / 2 + 24;
  const top = -H / 2 + 16;
  const photo = { x: left + 85, y: top + 230, w: 170, h: 130 };
  const rule = scene.add.graphics();
  rule.lineStyle(OUTLINE, COLORS.navy);
  rule.lineBetween(left, top + 40, W / 2 - 24, top + 40);
  rule.lineBetween(left, top + 46, W / 2 - 24, top + 46);
  return [
    sheet(scene, 0, 0, W, H, COLORS.cream),
    rule,
    scene.add.text(left, top + 4, clue.masthead, TEXT.normal),
    scene.add.text(W / 2 - 24, top + 8, clue.date, TEXT.small).setOrigin(1, 0),
    scene.add.text(left, top + 54, clue.headline, { ...TEXT.large, lineSpacing: -4 }),
    sheet(scene, photo.x, photo.y, photo.w, photo.h, COLORS.cream),
    pigeon(scene, photo.x, photo.y, 2.2),
    scene.add.text(photo.x, photo.y + photo.h / 2 + 4, '▲ 정문의 비둘기', TEXT.small).setOrigin(0.5, 0),
    scene.add.text(left + photo.w + 20, photo.y - photo.h / 2, clue.article, {
      ...TEXT.normal,
      wordWrap: { width: W - photo.w - 68 },
      lineSpacing: 4,
    }),
  ];
}

// 일기장: 노란 종이에 회색 줄, 왼쪽에 빨간 여백 줄. 한 줄에 한 문장씩 (줄바꿈하지 않는다).
function drawDiary(scene, clue) {
  const left = -W / 2;
  const top = -H / 2;
  const marginX = left + 56;
  const firstLine = top + 90;
  const gap = 58;
  const lines = scene.add.graphics();
  lines.lineStyle(2, COLORS.gray);
  for (let i = 0; i < clue.lines.length; i += 1) {
    const y = firstLine + i * gap + 34;
    lines.lineBetween(left + 10, y, W / 2 - 10, y);
  }
  lines.lineStyle(2, COLORS.red);
  lines.lineBetween(marginX, top + 6, marginX, H / 2 - 6);
  return [
    sheet(scene, 0, 0, W, H, COLORS.yellow),
    lines,
    scene.add.text(W / 2 - 24, top + 20, clue.date, TEXT.normal).setOrigin(1, 0),
    scene.add.text(marginX + 16, top + 20, '나의 일기', TEXT.normal),
    ...clue.lines.map((line, i) => scene.add.text(marginX + 16, firstLine + i * gap, line, TEXT.normal)),
  ];
}

// 쪽지: 가운데 작은 크림색 메모지, 위에 노란 테이프 두 장
function drawNote(scene, clue) {
  const w = 520;
  const h = 200;
  return [
    sheet(scene, 0, 10, w, h, COLORS.cream),
    sheet(scene, -w / 2 + 40, 10 - h / 2, 80, 24, COLORS.yellow).setRotation(-0.3),
    sheet(scene, w / 2 - 40, 10 - h / 2, 80, 24, COLORS.yellow).setRotation(0.3),
    scene.add.text(0, 10, clue.text, {
      ...TEXT.normal,
      align: 'center',
      wordWrap: { width: w - 60 },
      lineSpacing: 8,
    }).setOrigin(0.5),
  ];
}

// 안내판: 회색 판에 제목과 항목
function drawSign(scene, clue) {
  return [
    sheet(scene, 0, 0, W - 80, H - 40, COLORS.gray),
    scene.add.text(0, -H / 2 + 50, clue.heading, TEXT.large).setOrigin(0.5),
    scene.add.text(-W / 2 + 90, -H / 2 + 110, clue.lines.join('\n'), { ...TEXT.normal, lineSpacing: 14 }),
  ];
}

// 칠판: 진남색 판에 크림색 글씨, 오른쪽 아래에 소파 그림과 그쪽을 가리키는 화살표
function drawChalk(scene, clue) {
  const chalk = { ...TEXT.normal, color: CSS_COLORS.cream, lineSpacing: 10, wordWrap: { width: W - 120 } };
  const doodle = scene.add.graphics();
  doodle.lineStyle(OUTLINE, COLORS.cream);
  const sofa = { x: W / 2 - 120, y: H / 2 - 60 };
  doodle.strokeRoundedRect(sofa.x - 50, sofa.y - 18, 100, 36, 8);
  doodle.lineBetween(sofa.x - 200, sofa.y - 60, sofa.x - 64, sofa.y - 4);
  doodle.lineBetween(sofa.x - 64, sofa.y - 4, sofa.x - 84, sofa.y - 2);
  doodle.lineBetween(sofa.x - 64, sofa.y - 4, sofa.x - 72, sofa.y - 22);
  return [
    sheet(scene, 0, 0, W, H, COLORS.navy),
    scene.add.text(-W / 2 + 40, -H / 2 + 30, clue.lines.join('\n'), chalk),
    doodle,
    scene.add.text(sofa.x, sofa.y + 26, '소파', { ...TEXT.small, color: CSS_COLORS.cream }).setOrigin(0.5, 0),
  ];
}

// 시곗바늘만 있는 시계 (숫자 없음)
function clock(scene, x, y, hour, minute) {
  const r = 52;
  const g = scene.add.graphics();
  g.fillStyle(COLORS.cream);
  g.fillCircle(x, y, r);
  g.lineStyle(OUTLINE, COLORS.navy);
  g.strokeCircle(x, y, r);
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    const inner = i % 3 === 0 ? r - 12 : r - 7;
    g.lineBetween(x + Math.cos(a) * inner, y + Math.sin(a) * inner, x + Math.cos(a) * (r - 2), y + Math.sin(a) * (r - 2));
  }
  const hand = (turn, length, width) => {
    const a = turn * Math.PI * 2 - Math.PI / 2; // 12시 방향이 0
    g.lineStyle(width, COLORS.navy);
    g.lineBetween(x, y, x + Math.cos(a) * length, y + Math.sin(a) * length);
  };
  hand(((hour % 12) + minute / 60) / 12, r - 24, 6);
  hand(minute / 60, r - 10, 3);
  g.fillStyle(COLORS.navy);
  g.fillCircle(x, y, 5);
  return g;
}

// 코르크 게시판: 왼쪽에 시간표 종이, 오른쪽에 시계 그림 두 개가 있는 포스터
function drawPoster(scene, clue) {
  const sheetX = -W / 2 + 140;
  const posterX = 120;
  const posterW = 500;
  const clockY = 10;
  return [
    sheet(scene, 0, 0, W, H, COLORS.gray),
    sheet(scene, sheetX, -20, 220, 220, COLORS.cream).setRotation(-0.04),
    scene.add.text(sheetX, -110, '연습 시간표', TEXT.normal).setOrigin(0.5, 0),
    scene.add.text(sheetX, -70, clue.sheetLines.join('\n'), { ...TEXT.normal, align: 'center', lineSpacing: 10 })
      .setOrigin(0.5, 0),
    sheet(scene, posterX, 0, posterW, H - 40, COLORS.yellow),
    scene.add.text(posterX, -H / 2 + 36, clue.heading, TEXT.normal).setOrigin(0.5, 0),
    ...clue.clocks.flatMap(([hour, minute], i) => {
      const x = posterX + (i === 0 ? -110 : 110);
      return [
        clock(scene, x, clockY, hour, minute),
        scene.add.text(x, clockY + 62, clue.clockLabels[i], TEXT.normal).setOrigin(0.5, 0),
      ];
    }),
    scene.add.text(posterX, H / 2 - 36, clue.footer, TEXT.small).setOrigin(0.5, 1),
    // 압정
    ...[[sheetX, -125], [posterX - posterW / 2 + 20, -H / 2 + 34], [posterX + posterW / 2 - 20, -H / 2 + 34]]
      .map(([x, y]) => scene.add.circle(x, y, 7, COLORS.red).setStrokeStyle(2, COLORS.navy)),
  ];
}

// 액자: 두꺼운 회색 테 안에 사진(학생과 비둘기), 오른쪽에 뒷면 글씨
function drawPhoto(scene, clue) {
  const frameX = -W / 2 + 190;
  const person = scene.add.graphics();
  person.fillStyle(COLORS.gray);
  person.fillEllipse(frameX - 40, 60, 140, 70); // 어깨
  person.lineStyle(OUTLINE, COLORS.navy);
  person.strokeEllipse(frameX - 40, 60, 140, 70);
  person.fillStyle(COLORS.navy);
  person.fillCircle(frameX - 40, 0, 40); // 머리
  person.lineStyle(OUTLINE, COLORS.cream);
  person.strokeCircle(frameX - 56, 6, 10); // 안경
  person.strokeCircle(frameX - 24, 6, 10);
  return [
    sheet(scene, frameX, 10, 300, 270, COLORS.gray),
    sheet(scene, frameX, 10, 250, 220, COLORS.cream),
    person,
    pigeon(scene, frameX + 70, 70, 1.6),
    scene.add.text(frameX + 190, -110, clue.back, {
      ...TEXT.normal,
      wordWrap: { width: W / 2 - 50 },
      lineSpacing: 8,
    }),
  ];
}
