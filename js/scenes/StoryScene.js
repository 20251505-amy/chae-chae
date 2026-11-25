import Gugu from '../objects/Gugu.js';
import DialogBox from '../ui/DialogBox.js';
import { INTRO } from '../data/story.js';
import { COLORS } from '../ui/style.js';

// 시작 화면 다음의 첫 이야기 장면. 구구가 사연을 이야기하고, 대사가 끝나면 Stage 01을 시작한다.
export default class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
  }

  create() {
    const { width } = this.scale;

    // 가운데에 그림자를 단 구구가 천천히 위아래로 떠 있다.
    const shadow = this.add.ellipse(width / 2, 340, 60, 24, COLORS.navy, 0.35);
    const g = this.add.graphics();
    Gugu.drawLook(g, COLORS.gray);
    const gugu = this.add.container(width / 2, 280, [g]).setScale(3).setRotation(-Math.PI / 2);
    this.tweens.add({ targets: gugu, y: 260, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: shadow, scaleX: 0.85, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    new DialogBox(this).open(INTRO, () => this.scene.start('Stage01Scene'));
  }
}
