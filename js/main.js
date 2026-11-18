import TitleScene from './scenes/TitleScene.js';
import Stage01Scene from './scenes/Stage01Scene.js';
import Stage10Scene from './scenes/Stage10Scene.js';

const scenes = [TitleScene, Stage01Scene, Stage10Scene];

// 개발 확인용: index.html?stage=1 처럼 열면 해당 스테이지부터 시작한다.
const stageByParam = { 1: Stage01Scene, 10: Stage10Scene };
const startStage = stageByParam[new URLSearchParams(location.search).get('stage')];
if (startStage) {
  scenes.splice(scenes.indexOf(startStage), 1);
  scenes.unshift(startStage);
}

// PC 가로 화면 (16:9). 창 크기에 맞춰 비율을 유지한 채 확대·축소하고 가운데에 둔다.
const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#222222',
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

new Phaser.Game(config);
