import {Scene} from 'phaser';


export default class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  // init(data) {
  //   this.socket = data.socket;
  // }

  preload() {
    this.load.image('bckgrnd', 'src/assets/background.png')
    this.load.image('logo', 'src/assets/Wartank.png')
    this.load.image('start', 'src/assets/startBtn.png')
    this.load.image('tankUp', 'src/assets/tank_up32px.png');
    this.load.image('tankDown','src/assets/tank_dwn32px.png');
    this.load.image('tankLeft', 'src/assets/tank_lft32px.png');
    this.load.image('tankRight', 'src/assets/tank_rht32px.png');
    this.load.image('localPlayer', 'src/assets/tank_rht32px.png');
    this.load.image('tilesGrass', 'src/assets/maps/rpl_grass.png');
    this.load.image('tilePaths', 'src/assets/maps/rpl_paths-export.png')
    this.load.image('tilesSand', 'src/assets/maps/rpl_sand.png');
    this.load.tilemapTiledJSON('map1', 'src/assets/maps/tankMap.json');
    this.load.image('bullet', 'src/assets/bullet.png');
    this.load.image('bulletUp', 'src/assets/bullet_vert.png');
    this.load.html('key-form', '../../html/room-key-form.html');
    this.load.html('chat-form', '../../html/lobby-chat-form.html');
    this.load.image('start-sm', 'src/assets/start.png');
    this.load.image('tankBlue', 'src/assets/tank-blue.png');
    this.load.image('tankRed', 'src/assets/tank-green.png');
    this.load.image('tankGreen', 'src/assets/tank-red.png');
    this.load.image('tankYellow', 'src/assets/tank-yellow.png');
    this.load.image('breakable', '../src/assets/boxes/1.png');
    this.load.image('breakable2', '../src/assets/boxes/2.png');
    this.load.image('enemyPlayers', 'src/assets/tank_lft32px.png')
  }

  create() {
  this.scene.setActive(false, 'scene-lobby');

   this.add.sprite(600, 220, 'logo')
   this.strtBtn = this.add.sprite(600, 540, 'start')
   this.strtBtn.setInteractive();
   this.strtBtn.on('pointerdown', this.onDown,this);
    
    
    // this.scene.start ('scene-game')
  }
  onDown() {
    this.scene.start ('scene-lobby')
    // let data = "hello there from bootscene"
    // this.socket.emit("test", data)
  }



}

