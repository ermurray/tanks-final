import {Scene} from 'phaser';
import logoimg from '../assets/Wartank.png'
import startBtn from '../assets/startBtn.png'


export default class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  // init(data) {
  //   this.socket = data.socket;
  // }

  preload() {
    this.load.image('logo', logoimg)
    this.load.image('start', startBtn)

  }

  create() {
   this.add.sprite(600, 220, 'logo')
   this.strtBtn = this.add.sprite(600, 540, 'start')
   this.strtBtn.setInteractive();
   this.strtBtn.on('pointerdown', this.onDown,this);
    
    
    // this.scene.start ('scene-game')
  }
  onDown() {
    this.scene.start ('scene-game')
    // let data = "hello there from bootscene"
    // this.socket.emit("test", data)
  }



}

