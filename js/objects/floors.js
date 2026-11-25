// 실내 스테이지의 바닥: 나무 마루, 러그, 출입문 매트. 충돌 판정은 없고 맨 아래에 그림만 그린다.
// design.md: 5가지 색만 쓴다. 마루는 크림 바탕에 회색 반투명 판자 줄, 러그 · 매트는 회색 바탕에 진남색 외곽선.
import { COLORS, OUTLINE } from '../ui/style.js';

const { navy, gray, cream } = COLORS;
const FLOOR_DEPTH = -7;
const RUG_DEPTH = -6;

// 나무 마루: 가로 판자 줄과 줄마다 엇갈린 이음매, 판자마다 짧은 나뭇결 줄
export function drawWoodFloor(scene, { plank = 36, length = 160 } = {}) {
  const { width, height } = scene.scale;
  const g = scene.add.graphics().setDepth(FLOOR_DEPTH);
  for (let row = 0, y = 0; y < height; row += 1, y += plank) {
    g.lineStyle(2, gray, 0.5);
    g.lineBetween(0, y, width, y);
    const offset = (row % 3) * (length / 3);
    for (let x = offset; x < width; x += length) {
      g.lineStyle(2, gray, 0.5);
      g.lineBetween(x, y, x, y + plank);
      g.lineStyle(2, gray, 0.25); // 나뭇결
      g.lineBetween(x + 30, y + plank / 2, x + 70, y + plank / 2);
    }
  }
  return g;
}

// 직사각형 러그: 회색 바탕, 진남색 외곽선, 안쪽 크림색 테두리 두 줄, 가운데 마름모, 짧은 쪽 술
// rect: { x, y, width, height } (가운데 기준)
export function drawRug(scene, rect) {
  const g = scene.add.graphics().setDepth(RUG_DEPTH);
  const left = rect.x - rect.width / 2;
  const top = rect.y - rect.height / 2;
  g.lineStyle(2, cream);
  for (let y = top + 8; y < top + rect.height - 4; y += 10) {
    g.lineBetween(left - 8, y, left, y);
    g.lineBetween(left + rect.width, y, left + rect.width + 8, y);
  }
  g.fillStyle(gray);
  g.fillRoundedRect(left, top, rect.width, rect.height, 6);
  g.lineStyle(OUTLINE, navy);
  g.strokeRoundedRect(left, top, rect.width, rect.height, 6);
  g.lineStyle(3, cream);
  g.strokeRect(left + 12, top + 12, rect.width - 24, rect.height - 24);
  g.lineStyle(2, cream, 0.6);
  g.strokeRect(left + 22, top + 22, rect.width - 44, rect.height - 44);
  const dx = Math.min(rect.width, rect.height) / 4;
  g.lineStyle(3, cream, 0.6);
  g.strokePoints([
    { x: rect.x, y: rect.y - dx }, { x: rect.x + dx * 1.4, y: rect.y },
    { x: rect.x, y: rect.y + dx }, { x: rect.x - dx * 1.4, y: rect.y },
  ], true);
  return g;
}

// 출입문 매트: 회색 바탕에 크림색 가로줄
export function drawDoorMat(scene, rect) {
  const g = scene.add.graphics().setDepth(RUG_DEPTH);
  const left = rect.x - rect.width / 2;
  const top = rect.y - rect.height / 2;
  g.fillStyle(gray);
  g.fillRoundedRect(left, top, rect.width, rect.height, 4);
  g.lineStyle(OUTLINE, navy);
  g.strokeRoundedRect(left, top, rect.width, rect.height, 4);
  g.lineStyle(2, cream);
  for (let y = top + 10; y < top + rect.height - 6; y += 10) g.lineBetween(left + 8, y, left + rect.width - 8, y);
  return g;
}
