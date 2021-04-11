import {Scene} from 'phaser';
import io from 'socket.io-client';
import Player from '../entities/Player';
import unbreakableBlock from '../assets/platform.png';
import tank_down from '../assets/tank_dwn32px.png';
import tank_up from '../assets/tank_up32px.png';
import tank_left from '../assets/tank_lft32px.png';
import tank_right from '../assets/tank_rht32px.png';
import bullet from '../assets/bomb.png';
// import baseMap from '../assets/Maps/tankMap.json';
// import grassTiles from '../assets/Maps/rpl_grass.png';
// import sandTiles from '../assets/Maps/rpl_sand.png';


let logo;
let cursors;
let wasd;
let spacebar;
let tankP1;
let tankP2;

let p1Bullets;
let unbreakable;
let gameOver = false;
let hardWalls;


function destroyBullet (unbreakable, bullet) {
  bullet.disableBody(true, true);
}



export default class GameScene extends Scene {

  constructor () {
      super("scene-game");
      
  }


  preload () {
    this.load.image('unbreakable', unbreakableBlock);
    this.load.image('tankUp', tank_up);
    this.load.image('tankDown', tank_down);
    this.load.image('tankLeft', tank_left);
    this.load.image('tankRight', tank_right);
    this.load.image('bullet', bullet);
    this.load.image('tilesGrass', 'src/assets/maps/rpl_grass.png');
    this.load.image('tilesSand', 'src/assets/maps/rpl_sand.png');
    this.load.tilemapTiledJSON('map1', 'src/assets/maps/tankMap.json');
    this.load.image('player', 'src/assets/tank_rht32px.png');
  }
      
      
  
      
  create () {
    const map = this.createMap();
    const layers = this.createLayers(map);
    const boundary = layers.wallLayer;
    const player = this.createPlayer();
    
    this.physics.add.collider(player, boundary);
    
    // Create objects
    // tankP1 = this.physics.add.sprite(200, 200, 'tankP1');
    // tankP1.direction = "up";
    // unbreakable = this.physics.add.staticSprite(400, 400, 'unbreakable');
    // tankP1.setCollideWorldBounds(true);
    // this.physics.add.collider(tankP1, layers.wallLayer)

    // Add groups for Bullet objects
      // p1Bullets = this.physics.add.group({ key: "bullet" });
      // this.physics.add.collider(p1Bullets, layers.wallLayer)
    



    //SOCKETS
  //   let self = this;
  //   this.socket = io('http://localhost:3000') //this will need to change on prod server
  //   this.socket.on('connect', function() {
  //     console.log(`User: ... has connected`);
  //   });

  //   this.socket.on('currentPlayers', (players) => {
  //     Object.keys(players).forEach((id) => {
  //       if (players[id].playerId === self.socket.id) {
  //         addPlayer(self, players[id]);
  //       }
  //     });
  //   });
  //   this.otherPlayers = this.physics.add.group();
  //   this.socket.on('currentPlayers', function (players) {
  //     Object.keys(players).forEach(function (id) {
  //       if (players[id].playerId === self.socket.id) {
  //         addPlayer(self, players[id]);
  //       } else {
  //         addOtherPlayers(self, players[id]);
  //       }
  //     });
  //   });

  //   this.socket.on('newPlayer', function (playerInfo) {
  //     addOtherPlayers(self, playerInfo);
  //   });

  //   this.socket.on('remove', function (playerId) {
  //     self.otherPlayers.getChildren().forEach(function (otherPlayer) {
  //       if (playerId === otherPlayer.playerId) {
  //         otherPlayer.destroy();
  //       }
  //     });
  //   });

  //   // Add players
  //   function addPlayer(self, playerInfo) {
  //     self.tankP1 = self.physics.add.image(playerInfo.x, playerInfo.y, 'tankP1').setOrigin(0.5, 0.5).setDisplaySize(64, 64);
  //     // if (playerInfo.team === 'blue') {
  //     //   self.tankP1.setTint(0x0000ff);
  //     // } else {
  //     //   self.tankP1.setTint(0xff0000);
  //     // }
  //     self.tankP1.setDrag(100);
  //     self.tankP1.setAngularDrag(100);
  //     self.tankP1.setMaxVelocity(200);
  //   }

  //   function addOtherPlayers(self, playerInfo) {
  //     const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'tankP2').setOrigin(0.5, 0.5).setDisplaySize(64, 64);
  //     // if (playerInfo.team === 'blue') {
  //     //   otherPlayer.setTint(0x0000ff);
  //     // } else {
  //     //   otherPlayer.setTint(0xff0000);
  //     // }
  //     otherPlayer.playerId = playerInfo.playerId;
  //     self.otherPlayers.add(otherPlayer);
  //   }
    

  //   // Input
    

  //   this.socket.on('playerMoved', function (playerInfo) {
  //     self.otherPlayers.getChildren().forEach(function (otherPlayer) {
  //       if (playerInfo.playerId === otherPlayer.playerId) {
  //         otherPlayer.setRotation(playerInfo.rotation);
  //         otherPlayer.setPosition(playerInfo.x, playerInfo.y);
  //       }
  //     });
  //   });
   

  //   spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  //   // Collisions
  //   this.physics.add.collider(tankP1, unbreakable);
  //   this.physics.add.overlap(p1Bullets, unbreakable, destroyBullet, null, this);

    // bullets = this.physics.add.group();

  }

  // update() {
  //     // Movement
  //   //   const { left, right , up, down} = this.cursors;
  //   //   if (left.isDown || wasd.left.isDown) {
  //   //     console.log("left");
  //   //     this.player.setVelocityX(-this.playerSpeed);
  //   //     this.player.setTexture('tankLeft');
  //   //     this.player.direction = "left";
  //   //   }
  //   //   else if (right.isDown || wasd.right.isDown) {
  //   //     console.log("right");
  //   //     this.player.setVelocityX(this.playerSpeed);
  //   //     this.player.setTexture('tankRight');
  //   //     this.player.direction = "right";
  //   //   }
  //   //   else if (up.isDown || wasd.up.isDown) {
  //   //     console.log("up");
  //   //     this.player.setVelocityY(-this.playerSpeed);
  //   //     this.player.setTexture('tankUp');
  //   //     this.player.direction = "up";
  //   //   }
  //   //   else if (down.isDown || wasd.down.isDown) {
  //   //     console.log("down");
  //   //     this.player.setVelocityY(this.playerSpeed);
  //   //     this.player.setTexture('tankDown');
  //   //     this.player.direction = "down";
  //   //   }
  //   //   // else if (Phaser.Input.Keyboard.JustDown(spacebar)) {
  //   //   //   console.log("shoot");
  //   //   //   let bullet = p1Bullets.create(this.player.x, this.player.y, 'bullet');
  //   //   //   if (this.player.direction === "left") {
  //   //   //     bullet.setVelocityX(-600);
  //   //   //   }
  //   //   //   else if (this.player.direction === "right") {
  //   //   //     bullet.setVelocityX(600);
  //   //   //   }
  //   //   //   else if (this.player.direction === "up") {
  //   //   //     bullet.setVelocityY(-600);
  //   //   //   }
  //   //   //   else if (this.player.direction === "down") {
  //   //   //     bullet.setVelocityY(600);
  //   //   //     bullet.allowGravity = false;
  //   //   //   }
  //   //   // }
  //   //   else
  //   //   {
  //   //     this.player.setVelocityX(0);
  //   //     this.player.setVelocityY(0);
  //   //   }
      
  //   // // let x = this.tankP1.x;
  //   // // let y = this.tankP1.y;
  //   // // let r = this.tankP1.rotation;
  //   // // if (
  //   // //   this.tankP1.oldPosition &&
  //   // //   (x !== this.tankP1.oldPosition.x ||
  //   // //     y !== this.tankP1.oldPosition.y ||
  //   // //     r !== this.tankP1.oldPosition.rotation)
  //   // // ) {
  //   // //   this.socket.emit("playerMovement", {
  //   // //     x: this.tankP1.x,
  //   // //     y: this.tankP1.y,
  //   // //     rotation: this.tankP1.rotation,
  //   // //   });
  //   // // }

  //   // // // save old position data
  //   // // this.tankP1.oldPosition = {
  //   // //   x: this.tankP1.x,
  //   // //   y: this.tankP1.y,
  //   // //   rotation: this.tankP1.rotation,
  //   // // };



  //     // Game Over
  //     if (gameOver === true) {
  //       return;
  //     }


  // }

  createMap() {
    const map = this.make.tilemap({key: 'map1'});
    map.addTilesetImage('rpl_grass', 'tilesGrass', 32, 32);
    map.addTilesetImage('rpl_sand','tilesSand', 32, 32);
   
    return map;
  }

  createLayers(map) {
    const tilesetGrass = map.getTileset('rpl_grass');
    const tilesetSand = map.getTileset('rpl_sand');
    const groundLayer = map.createLayer('background', [tilesetGrass, tilesetSand], 0, 0);
    const wallLayer = map.createLayer('blockedlayer', [tilesetGrass, tilesetSand], 0, 0);

    wallLayer.setCollisionByExclusion([-1]);
    return {groundLayer, wallLayer};

  }

  createPlayer() {
    return new Player(this,100,100,);
  }
  


}
