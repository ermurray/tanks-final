import {Scene} from 'phaser';


export default class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  // init(data) {
  //   this.socket = data.socket;
  // }

  preload() {
    this.load.image('bckgrnd', 'public/assets/background.png')
    this.load.image('logo', 'public/assets/Wartank.png')
    this.load.image('start', 'public/assets/startBtn.png')
    this.load.image('tankUp', 'public/assets/tank_up32px.png');
    this.load.image('tankDown','public/assets/tank_dwn32px.png');
    this.load.image('tankLeft', 'public/assets/tank_lft32px.png');
    this.load.image('tankRight', 'public/assets/tank_rht32px.png');
    this.load.image('localPlayer', 'public/assets/tank_rht32px.png');
    this.load.image('tilesGrass', 'public/assets/maps/rpl_grass.png');
    this.load.image('tilePaths', 'public/assets/maps/rpl_paths-export.png')
    this.load.image('tilesSand', 'public/assets/maps/rpl_sand.png');
    this.load.tilemapTiledJSON('map1', 'public/assets/maps/tankMap.json');
    this.load.image('bullet', 'public/assets/bullet.png');
    this.load.image('bulletUp', 'public/assets/bullet_vert.png');
    this.load.html('key-form', 'public/html/room-key-form.html');
    this.load.html('chat-form', 'public/html/lobby-chat-form.html');
    this.load.image('start-sm', 'public/assets/start.png');
    this.load.image('tankBlue', 'public/assets/tank-blue.png');
    this.load.image('tankRed', 'public/assets/tank-green.png');
    this.load.image('tankGreen', 'public/assets/tank-red.png');
    this.load.image('tankYellow', 'public/assets/tank-yellow.png');
    this.load.image('breakable', 'public/assets/boxes/1.png');
    this.load.image('breakable2', 'public/assets/boxes/2.png');
    this.load.image('breakable3', 'public/assets/boxes/3.png');
    this.load.image('enemyPlayers', 'public/assets/tank_lft32px.png')
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

