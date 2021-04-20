import Phaser from 'phaser';
import {Scene} from 'phaser';
import io from 'socket.io-client';

export default class GameOver extends Scene {
  constructor() {
    super('scene-gameover');
  }

  create() {
    // this.scene.setActive(false, 'scene-lobby');
    // this.scene.setActive(true, 'scene-gameover');

    // this.scene.moveAbove("scene-game", 'scene-gameover');
    console.log("Game Over");
    this.add.text(600, 200, 'Game Over');
    this.strtBtn = this.add.sprite(400, 400, 'start');
    this.strtBtn.setInteractive();
    this.strtBtn.on('pointerdown', this.playAgain, this);
    this.restartBtn = this.add.sprite(900, 400, 'start');
    this.restartBtn.setInteractive();
    this.restartBtn.on('pointerdown', this.restart, this);
  }

  playAgain() {
    this.registry.destroy();
    this.events.off();
    this.scene.restart();
    this.scene.start('scene-lobby');
  }

  restart() {
    this.registry.destroy();
    this.events.off();
    this.scene.restart();
    this.scene.start('scene-boot');
  }
}