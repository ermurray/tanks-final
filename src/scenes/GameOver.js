import Phaser from 'phaser';
import io from 'socket.io-client';

export default class GameOver extends Scene {
  constructor() {
    super('scene-gameover');
  }

  create() {
    this.scene.setActive(false, 'scene-lobby');

    this.add.text(200, 540, 'Game Over');
    this.strtBtn = this.add.sprite(400, 540, 'Play Again')
    this.strtBtn.setInteractive();
    this.strtBtn.on('pointerdown', this.onDown,this);
  }

  onDown() {
    this.scene.start('scene-lobby');
  }
}