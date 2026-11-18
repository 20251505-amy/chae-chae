// 4자리 비밀번호 키패드. 키패드를 Enter로 쪼면 열린다.
// 방향키 / WASD로 숫자를 고르고 Enter로 쪼아 누른다. 게임은 멈추지 않는다.
// 디자인은 [미정]이라 지금은 단순한 상자와 칸으로 그린다.
const CODE_LENGTH = 4;
const LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '닫기', '0', ''];
const COLS = 3;
const CELL = 70;
const STEP = 80; // 칸 크기 + 간격

export default class KeypadPanel {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;

    const { width, height } = scene.scale;
    this.container = scene.add.container(width / 2, height / 2).setDepth(110).setVisible(false);
    this.container.add(scene.add.rectangle(0, 0, 270, 400, 0x000000, 0.85));

    this.display = scene.add.text(0, -155, '', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);
    this.container.add(this.display);

    this.cells = LABELS.map((label, i) => {
      const x = (i % COLS - 1) * STEP;
      const y = -85 + Math.floor(i / COLS) * STEP;
      if (label) {
        this.container.add(scene.add.rectangle(x, y, CELL, CELL, 0x444444));
        this.container.add(scene.add.text(x, y, label, {
          fontSize: label.length > 1 ? '18px' : '28px',
          color: '#ffffff',
        }).setOrigin(0.5));
      }
      return { x, y, label };
    });

    this.cursor = scene.add.rectangle(0, 0, CELL, CELL).setStrokeStyle(3, 0xffe08a);
    this.container.add(this.cursor);

    this.container.add(scene.add.text(0, 220, '방향키로 고르고 Enter로 쪼기', {
      fontSize: '16px',
      color: '#cccccc',
    }).setOrigin(0.5));

    scene.input.keyboard.on('keydown', (event) => {
      if (this.isOpen) this.handleKey(event.code);
    });
  }

  // code: 정답 4자리 문자열, onSuccess: 맞혔을 때 실행할 함수
  open(code, onSuccess) {
    this.code = code;
    this.onSuccess = onSuccess;
    this.input = '';
    this.index = 0;
    this.isOpen = true;
    this.container.setVisible(true);
    this.render();
  }

  close() {
    this.isOpen = false;
    // 닫을 때 누른 Enter가 구구의 쪼기로 이어져 바로 다시 열리지 않게 한다.
    this.justClosed = true;
    this.container.setVisible(false);
  }

  handleKey(code) {
    const moves = {
      ArrowLeft: [-1, 0], KeyA: [-1, 0],
      ArrowRight: [1, 0], KeyD: [1, 0],
      ArrowUp: [0, -1], KeyW: [0, -1],
      ArrowDown: [0, 1], KeyS: [0, 1],
    };
    if (moves[code]) {
      const [mx, my] = moves[code];
      const col = Phaser.Math.Clamp(this.index % COLS + mx, 0, COLS - 1);
      const row = Phaser.Math.Clamp(Math.floor(this.index / COLS) + my, 0, LABELS.length / COLS - 1);
      this.index = row * COLS + col;
      this.render();
    } else if (code === 'Enter' || code === 'NumpadEnter') {
      this.press(LABELS[this.index]);
    }
  }

  press(label) {
    if (!label) return;
    if (label === '닫기') {
      this.close();
      return;
    }

    this.input += label;
    this.render();
    if (this.input.length < CODE_LENGTH) return;

    if (this.input === this.code) {
      this.close();
      this.onSuccess();
    } else {
      this.input = '';
      this.display.setText('틀렸다!');
    }
  }

  render() {
    this.display.setText(this.input.padEnd(CODE_LENGTH, '_').split('').join(' '));
    const cell = this.cells[this.index];
    this.cursor.setPosition(cell.x, cell.y);
  }
}
