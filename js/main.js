import TitleScene from './scenes/TitleScene.js';
import Stage01Scene from './scenes/Stage01Scene.js';
import Stage02Scene from './scenes/Stage02Scene.js';
import Stage10Scene from './scenes/Stage10Scene.js';
import EndingScene from './scenes/EndingScene.js';
import { CSS_COLORS } from './ui/style.js';

const scenes = [TitleScene, Stage01Scene, Stage02Scene, Stage10Scene, EndingScene];

// 개발 확인용: index.html?stage=1 처럼 열면 해당 스테이지부터 시작한다.
const stageByParam = { 1: Stage01Scene, 2: Stage02Scene, 10: Stage10Scene };
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

// 글꼴(Gaegu 굵게)을 먼저 불러온 뒤 게임을 시작한다. 불러오지 못해도 기본 글꼴로 시작한다.
document.fonts.load('bold 22px Gaegu').finally(() => new Phaser.Game(config));
