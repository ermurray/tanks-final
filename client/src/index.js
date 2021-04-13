import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import WaitingRoom from './scenes/WaitingRoom';
import Lobby from './scenes/Lobby';


//config constants
const WIDTH = 1216
const HEIGHT = 640

//common configs between scenes
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT
}

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  parent: 'game',
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: true
      }
  },
  dom: {
    createContainer: true,
  },
  scene:[
    BootScene,
    WaitingRoom,
    GameScene,
    Lobby,
    
    
  ]
};

const game = new Phaser.Game(config);
