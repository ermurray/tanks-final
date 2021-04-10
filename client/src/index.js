import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
    
const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1200,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: true
      }
  },
  scene:[
    BootScene,
    GameScene,
  ]
};

const game = new Phaser.Game(config);
