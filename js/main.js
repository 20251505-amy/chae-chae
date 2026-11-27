import TitleScene from './scenes/TitleScene.js';
import StoryScene from './scenes/StoryScene.js';
import Stage01Scene from './scenes/Stage01Scene.js';
import Stage02Scene from './scenes/Stage02Scene.js';
import Stage03Scene from './scenes/Stage03Scene.js';
import Stage10Scene from './scenes/Stage10Scene.js';
import EndingScene from './scenes/EndingScene.js';
import { CSS_COLORS, FONT_FAMILY } from './ui/style.js';

const scenes = [TitleScene, StoryScene, Stage01Scene, Stage02Scene, Stage03Scene, Stage10Scene, EndingScene];

// 개발 확인용: index.html?stage=1 처럼 열면 해당 스테이지부터 시작한다.
const stageByParam = { 1: Stage01Scene, 2: Stage02Scene, 3: Stage03Scene, 10: Stage10Scene };
const startStage = stageByParam[new URLSearchParams(location.search).get('stage')];
if (startStage) {
  scenes.splice(scenes.indexOf(startStage), 1);
  scenes.unshift(startStage);
}

// PC 가로 화면 (16:9). 창 크기에 맞춰 비율을 유지한 채 확대·축소하고 가운데에 둔다.
const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: CSS_COLORS.cream,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
  // 탑다운 시점이므로 중력은 0으로 둔다.
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 } },
  },
  scene: scenes,
};

// 글꼴(style.js의 FONT_FAMILY)을 먼저 불러온 뒤 게임을 시작한다. 불러오지 못해도 기본 글꼴로 시작한다.
// Google Fonts는 한글 글꼴을 글자 범위별로 여러 조각(약 90개)으로 나눠 보내고, 쓰는 글자의 조각만 그때그때 받는다.
// 캔버스 글씨는 한 번 그리면 다시 그리지 않으므로, 조각이 늦게 오면 그 글자만 기본 글꼴로 남아 글씨체가 뒤섞인다.
// 그래서 모든 조각을 미리 받은 뒤에 시작한다.
const fontFaces = [...document.fonts].filter((face) => face.family.replace(/["']/g, '') === FONT_FAMILY);
const fontLoads = fontFaces.length
  ? fontFaces.map((face) => face.load())
  : [document.fonts.load(`22px ${FONT_FAMILY}`, '가나다')]; // 글꼴 목록을 아직 못 읽었을 때
Promise.all(fontLoads)
  .catch(() => {})
  .finally(() => new Phaser.Game(config));
