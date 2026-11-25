// 바깥 스테이지의 바닥(길 · 광장)과 디자인용 건물. 충돌 판정은 없고 그림만 그린다.
// 실제 서울교대 배치를 본떴다: 정문(사향문)을 들어서면 왼쪽에 미술2관(1층 다솜채 카페),
// 오른쪽에 사향융합체육관이 있다. (서울교대 캠퍼스맵 · 나무위키 참고)
// design.md: 5가지 색만 쓰고 진남색 외곽선 3px. 잔디색이 없으므로 바닥은 크림, 길은 회색 반투명으로 나타낸다.
import { COLORS, CSS_COLORS, OUTLINE, TEXT } from '../ui/style.js';

const { navy, gray, cream } = COLORS;
const FLOOR_DEPTH = -6;
const BUILDING_DEPTH = -5;

// 보도블록 길: 회색 반투명 바탕, 진남색 가장자리 선, 크림색 블록 줄눈
// rect: { x, y, width, height } (가운데 기준)
export function drawWalkway(scene, rect, { blocks = 28 } = {}) {
  const g = scene.add.graphics().setDepth(FLOOR_DEPTH);
  const left = rect.x - rect.width / 2;
  const top = rect.y - rect.height / 2;
  g.fillStyle(gray, 0.45);
  g.fillRect(left, top, rect.width, rect.height);
  g.lineStyle(2, cream, 0.8);
  const horizontal = rect.width >= rect.height;
  if (horizontal) {
    for (let x = left + blocks; x < left + rect.width; x += blocks) g.lineBetween(x, top + 3, x, top + rect.height - 3);
    g.lineBetween(left, rect.y, left + rect.width, rect.y);
  } else {
    for (let y = top + blocks; y < top + rect.height; y += blocks) g.lineBetween(left + 3, y, left + rect.width - 3, y);
    g.lineBetween(rect.x, top, rect.x, top + rect.height);
  }
  g.lineStyle(2, navy, 0.6);
  if (horizontal) {
    g.lineBetween(left, top, left + rect.width, top);
    g.lineBetween(left, top + rect.height, left + rect.width, top + rect.height);
  } else {
    g.lineBetween(left, top, left, top + rect.height);
    g.lineBetween(left + rect.width, top, left + rect.width, top + rect.height);
  }
  return g;
}

// 둥근 광장: 회색 반투명 원에 크림색 동심원 줄눈
export function drawPlaza(scene, x, y, radius) {
  const g = scene.add.graphics().setDepth(FLOOR_DEPTH);
  g.fillStyle(gray, 0.45);
  g.fillCircle(x, y, radius);
  g.lineStyle(2, cream, 0.8);
  for (let r = radius - 18; r > 10; r -= 18) g.strokeCircle(x, y, r);
  g.lineStyle(2, navy, 0.6);
  g.strokeCircle(x, y, radius);
  return g;
}

// 위에서 본 건물: 그림자, 회색 옥상, 안쪽 난간 줄, 옥상 실외기, 크림색 이름판
// b: { x, y, width, height, name, sub? } (가운데 기준)
export function drawBuilding(scene, b) {
  const g = scene.add.graphics().setDepth(BUILDING_DEPTH);
  const left = b.x - b.width / 2;
  const top = b.y - b.height / 2;
  g.fillStyle(navy, 0.35);
  g.fillRoundedRect(left + 8, top + 8, b.width, b.height, 6);
  g.fillStyle(gray);
  g.fillRoundedRect(left, top, b.width, b.height, 6);
  g.lineStyle(OUTLINE, navy);
  g.strokeRoundedRect(left, top, b.width, b.height, 6);
  g.lineStyle(2, navy, 0.35);
  g.strokeRoundedRect(left + 8, top + 8, b.width - 16, b.height - 16, 4);
  // 옥상 실외기 두 대 (팬 날개 원)
  [[left + 24, top + 24], [left + 52, top + 24]].forEach(([ux, uy]) => {
    g.fillStyle(cream);
    g.fillRect(ux - 10, uy - 10, 20, 20);
    g.lineStyle(2, navy);
    g.strokeRect(ux - 10, uy - 10, 20, 20);
    g.strokeCircle(ux, uy, 6);
  });

  const label = b.sub ? `${b.name}\n${b.sub}` : b.name;
  const text = scene.add.text(b.x, b.y + 6, label, {
    ...TEXT.small,
    align: 'center',
    backgroundColor: CSS_COLORS.cream,
    padding: { x: 8, y: 4 },
  }).setOrigin(0.5).setDepth(BUILDING_DEPTH);
  return [g, text];
}

// 정문 기둥 한 쌍과 이름표. 길(가로)의 왼쪽 끝에 세운다.
// x: 기둥 가로 위치, y: 길 가운데, gap: 두 기둥 사이 (길 폭)
export function drawGate(scene, x, y, gap, name) {
  const g = scene.add.graphics().setDepth(BUILDING_DEPTH);
  [-1, 1].forEach((side) => {
    const py = y + side * (gap / 2 + 12);
    g.fillStyle(navy, 0.35);
    g.fillRoundedRect(x - 12 + 5, py - 12 + 5, 24, 24, 4);
    g.fillStyle(gray);
    g.fillRoundedRect(x - 12, py - 12, 24, 24, 4);
    g.lineStyle(OUTLINE, navy);
    g.strokeRoundedRect(x - 12, py - 12, 24, 24, 4);
    g.fillStyle(cream);
    g.fillCircle(x, py, 5);
  });
  const text = scene.add.text(x + 20, y - gap / 2 - 30, name, TEXT.small).setOrigin(0, 0.5).setDepth(BUILDING_DEPTH);
  return [g, text];
}
