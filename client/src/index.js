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
  height: HEIGHT,

}

const Scenes = [BootScene, WaitingRoom, GameScene, Lobby];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  render: {
    pixelArt: false,
  },
  scale:{
    parent: 'game-container',
    autoCenter: true,
  },
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
  scene: initScenes()
};

const game = new Phaser.Game(config);
