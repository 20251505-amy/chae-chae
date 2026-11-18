import { COLORS } from '../ui/style.js';

// 학생 NPC 겉모습 5가지. 위에서 내려다본 가방 멘 학생을 오른쪽(0도)을 보는 모습으로 그린다.
// design.md의 5가지 색 안에서 머리 모양 · 머리 색 · 옷 색 · 가방 색을 다르게 조합한다.
const LINE = 2;

const LOOKS = [
  { style: 'short', hair: COLORS.navy, top: COLORS.gray, bag: COLORS.yellow }, // 짧은 머리
  { style: 'long', hair: COLORS.navy, top: COLORS.cream, bag: COLORS.gray }, // 긴 생머리
  { style: 'cap', hair: COLORS.yellow, top: COLORS.navy, bag: COLORS.gray }, // 노란 모자
  { style: 'ponytail', hair: COLORS.gray, top: COLORS.yellow, bag: COLORS.navy }, // 묶은 머리
  { style: 'buns', hair: COLORS.yellow, top: COLORS.gray, bag: COLORS.cream }, // 양쪽 똥머리
];

function drawStudent(g, { style, hair, top, bag }) {
  g.lineStyle(LINE, COLORS.navy);

  // 등에 멘 가방
  g.fillStyle(bag);
  g.fillRoundedRect(-16, -9, 9, 18, 3);
  g.strokeRoundedRect(-16, -9, 9, 18, 3);

  // 양손
  g.fillStyle(COLORS.cream);
  [-1, 1].forEach((side) => {
    g.fillCircle(8, side * 14, 3.5);
    g.strokeCircle(8, side * 14, 3.5);
  });

  // 어깨와 상의
  g.fillStyle(top);
  g.fillEllipse(0, 0, 18, 34);
  g.strokeEllipse(0, 0, 18, 34);

  // 등으로 내려오는 긴 머리
  if (style === 'long') {
    g.fillStyle(hair);
    g.fillEllipse(-6, 0, 12, 18);
  }

  // 머리: 얼굴(크림)을 그리고 뒤쪽을 머리카락으로 덮어 앞쪽만 얼굴이 보이게 한다
  g.fillStyle(COLORS.cream);
  g.fillCircle(1, 0, 8);
  g.fillStyle(hair);
  g.fillEllipse(-1.5, 0, 13, 16);
  g.strokeCircle(1, 0, 8);

  if (style === 'cap') {
    g.fillStyle(hair);
    g.fillRoundedRect(6, -6, 6, 12, 2); // 모자 챙
    g.strokeRoundedRect(6, -6, 6, 12, 2);
  } else if (style === 'ponytail') {
    g.fillStyle(hair);
    g.fillCircle(-10, 0, 4);
    g.strokeCircle(-10, 0, 4);
  } else if (style === 'buns') {
    g.fillStyle(hair);
    [-1, 1].forEach((side) => {
      g.fillCircle(-3, side * 7, 3.5);
      g.strokeCircle(-3, side * 7, 3.5);
    });
  }

  // 코
  if (style !== 'cap') {
    g.lineStyle(1, COLORS.navy);
    g.fillStyle(COLORS.cream);
    g.fillCircle(9, 0, 1.8);
    g.strokeCircle(9, 0, 1.8);
  }
}

// STUDENT_LOOKS[i]는 graphics에 i번째 학생을 그리는 함수다.
export const STUDENT_LOOKS = LOOKS.map((look) => (g) => drawStudent(g, look));
