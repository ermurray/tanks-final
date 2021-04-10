import {Scene} from 'phaser';
import logoimg from '../assets/Wartank.png'
import startBtn from '../assets/StartBtn.png'


export default class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }

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
  }



}

