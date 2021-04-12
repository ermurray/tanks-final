import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import WaitingRoom from './scenes/WaitingRoom'
    
const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1216,
  height: 640,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
  },
  scene:[
    
    BootScene,
    GameScene,
    WaitingRoom,
    
  ]
};

const game = new Phaser.Game(config);
