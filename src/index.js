import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import WaitingRoom from './scenes/WaitingRoom';
import Lobby from './scenes/Lobby';


//config constants
const MAP_WIDTH = 1216;
const MAP_HEIGHT = 640;
// const WIDTH = document.body.offsetWidth
const WIDTH = 1216
const HEIGHT = 640
const ZOOM_FACTOR = 1.3
//common configs between scenes
const SHARED_CONFIG = {
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  width: WIDTH,
  height: HEIGHT,
  zoomfactor: ZOOM_FACTOR
}

const Scenes = [BootScene, WaitingRoom, GameScene, Lobby];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  render: {
    pixelArt: true,
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
