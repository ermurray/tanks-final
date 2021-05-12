import Phaser from 'phaser';
// import mainTheme from '../../public/assets/Audio/soundtracks/'


export default class BootScene extends Phaser.Scene {
  constructor() {
    super("scene-boot");
  }
  // init(data) {
  //   this.socket = data.socket;
  // }
  
  preload() {
    this.load.image('bckgrnd', './assets/background.png');
    this.load.image('logo', './assets/Wartank.png');
    this.load.image('start', './assets/new-start.png');
    this.load.image('start-p', './assets/new-start-pressed.png');
    this.load.image('player1', './assets/tank_blue_rht48px.png');
    this.load.image('player2', './assets/tank_red_lft48px.png');
    this.load.image('player3', './assets/tank_green_rht48px.png');
    this.load.image('player4', './assets/tank_yellow_lft48px.png');
    this.load.image('frame', './assets/camera_frame.png');
    this.load.image('hud', './assets/hud.png');
    this.load.image('tilesGrass', './assets/maps/rpl_grass.png');
    this.load.image('tilesPaths', './assets/maps/rpl_paths-export.png')
    this.load.image('tilesSand', './assets/maps/rpl_sand.png');
    this.load.tilemapTiledJSON('map1', './assets/maps/tankMap.json');
    this.load.image('bullet', './assets/bullet.png');
    this.load.image('enemyBullet', './assets/enemy_bullet.png');
    this.load.html('key-form', './html/room-key-form.html');
    this.load.html('chat-form', './html/lobby-chat-form.html');
    this.load.image('readyBtn', './assets/ready-green-b.png');
    this.load.image('readyBtn-p', './assets/ready-green-pressed.png');
    this.load.image('new-game', './assets/new-game.png');
    this.load.image('new-game-p', './assets/new-game-pressed.png');
    this.load.image('restart', './assets/restart.png');
    this.load.image('restart-p', './assets/restart-pressed.png');
    this.load.image('tankBlue', './assets/tank-blue.png');
    this.load.image('tankRed', './assets/tank-red.png');
    this.load.image('tankGreen', './assets/tank-green.png');
    this.load.image('tankYellow', './assets/tank-yellow.png');
    this.load.spritesheet('woodBox', './assets/boxes/box_wood_sheet.png', {
      frameWidth: 48, frameHeight: 48, spacing: 48
    });
    this.load.spritesheet('greyBox', './assets/boxes/box_grey_sheet.png', {
      frameWidth: 48, frameHeight: 48, spacing: 48
    });
    this.load.image('enemyPlayers', './assets/tank_lft32px.png');
    this.load.image('overlay', './assets/overlay.png')
    this.load.spritesheet('blue_tank_spritesheet', './assets/tanks/tank_blue_walk.png',{frameWidth: 48, frameHeight: 48});
    this.load.spritesheet('bulletImpact', './assets/bullet_impact_sheet.png', {
      frameWidth: 32, frameHeight: 32, spacing: 32
    })
    this.load.spritesheet('hearts', './assets/heart_32px-sheet.png', {
        frameWidth: 32, frameHeight: 32, spacing: 32
    })
    //load audio
    this.load.audio('mainTheme', './assets/Audio/soundTracks/mainTheme.wav');
    this.load.audio('gameTheme', './assets/Audio/soundTracks/gameTheme.wav');
    this.load.audio('buttonClick', './assets/Audio/sfx/button_click.wav');
    this.load.audio('hitExplode', './assets/Audio/sfx/explode.wav');
    this.load.audio('collect', './assets/Audio/sfx/pickUp.wav');
    this.load.audio('shot','./assets/Audio/sfx/shot.wav');
    this.load.audio('boxDestroy','./assets/Audio/sfx/box_destroy.wav');
    this.load.audio('tankHit', './assets/Audio/sfx/explode.wav');
    this.load.audio('tankEngine','./assets/Audio/sfx/tank-engine-sound.ogg');

   
  }

  create() {
    // this.scene.setActive(false, 'scene-lobby');
    this.add.image(0,0, 'bckgrnd').setOrigin(0).setScale(0.5);
    this.scene.setActive(false, 'scene-lobby');
    this.buttonClick = this.sound.add('buttonClick', {loop: false, volume: 0.5});
    this.add.sprite(600, 220, 'logo');
    this.strtBtn = this.add.sprite(600, 540, 'start');
    this.strtBtn.setInteractive();
    this.strtBtn.on('pointerdown', this.onDown, this);
      
    // this.scene.start ('scene-game')
  }
  onDown() {
    
    this.strtBtn.setTexture('start-p');
    setTimeout(()=>{
      this.strtBtn.setTexture('start');
    },200)
    this.buttonClick.play();
    setTimeout(()=>{
      this.scene.start('scene-lobby')
    }, 300);
    // let data = "hello there from bootscene"
    // this.socket.emit("test", data)
  }



}

