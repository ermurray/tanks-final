import Phaser from 'phaser';


export default class Lobby extends Phaser.Scene {
  constructor() {
    super('scene-lobby');
    // this.state = {};
    // this.hasBeenSet = false;
  }

  create() {
  
    this.strtSmall = this.add.sprite(600, 540, 'start-sm')
    this.strtSmall.setInteractive();
    this.strtSmall.on('pointerdown', this.onDown,this)
  }

  onDown() {
    this.scene.start ('scene-game')
    // let data = "hello there from bootscene"
    // this.socket.emit("test", data)
  }
}