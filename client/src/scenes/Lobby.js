import Phaser from 'phaser';
import io from 'socket.io-client';


export default class Lobby extends Phaser.Scene {
  constructor() {
    super('scene-lobby');
    // this.state = {};
    // this.hasBeenSet = false;
  }
  init(){

  }
 
  create() {
    this.textInput = this.add.dom(1135, 600).createFromCache('chat-form').setOrigin(0.5);   
    this.chat = this.add.text(1000, 10, "",{
      lineSpacing: 15,
      backroundColor: '#21313CDD',
      color: '#26924F',
      padding: 10,
      fontStyle: 'bold'
    });

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