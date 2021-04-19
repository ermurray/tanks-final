import {Scene} from 'phaser';


export default class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  // init(data) {
  //   this.socket = data.socket;
  // }
  
  preload() {
    this.load.image('bckgrnd', 'assets/background.png')
    this.load.image('logo', 'assets/Wartank.png')
    this.load.image('start', 'assets/startBtn.png')
    this.load.image('tankUp', './assets/tank_up32px.png');
    this.load.image('tankDown','./assets/tank_dwn32px.png');
    this.load.image('tankLeft', './assets/tank_lft32px.png');
    this.load.image('tankRight', './assets/tank_rht32px.png');
    this.load.image('localPlayer', './assets/tank_rht32px.png');
    this.load.image('tilesGrass', './assets/maps/rpl_grass.png');
    this.load.image('tilePaths', './assets/maps/rpl_paths-export.png')
    this.load.image('tilesSand', './assets/maps/rpl_sand.png');
    this.load.tilemapTiledJSON('map1', './assets/maps/tankMap.json');
    this.load.image('bullet', './assets/bullet.png');
    this.load.image('bulletUp', './assets/bullet_vert.png');
    this.load.html('key-form', './html/room-key-form.html');
    this.load.html('chat-form', './html/lobby-chat-form.html');
    this.load.image('start-sm', './assets/start.png');
    this.load.image('tankBlue', './assets/tank-blue.png');
    this.load.image('tankRed', './assets/tank-green.png');
    this.load.image('tankGreen', './assets/tank-red.png');
    this.load.image('tankYellow', './assets/tank-yellow.png');
    this.load.image('breakable', './assets/boxes/1.png');
    this.load.image('breakable2', './assets/boxes/2.png');
    this.load.image('breakable3', './assets/boxes/3.png');
    this.load.image('enemyPlayers', './assets/tank_lft32px.png');

    console.log("env check:", process.env)
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

