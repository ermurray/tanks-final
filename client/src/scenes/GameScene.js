import {Scene} from 'phaser';
import io from 'socket.io-client';
import tankBlue from '../assets/tank-blue.png';
import tankGreen from '../assets/tank-green.png';
import tankYellow from  '../assets/tank-yellow.png';
import tankRed from  '../assets/tank-red.png';
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

function destroyBullet2(bullet, wall) {
  bullet.disableBody(true, true);
}


export default class GameScene extends Scene {

  constructor () {
      super("scene-game");
      
  }


  preload () {
      this.load.image('tankP1', tank_right);
      //this.load.image('tankP2', tankRed);
      this.load.image('unbreakable', unbreakableBlock);
      this.load.image('tankUp', tank_up);
      this.load.image('tankDown', tank_down);
      this.load.image('tankLeft', tank_left);
      this.load.image('tankRight', tank_right);
      this.load.image('bullet', bullet);
      this.load.image('tilesGrass', 'src/assets/maps/rpl_grass.png');
      this.load.image('tilesSand', 'src/assets/maps/rpl_sand.png');
      this.load.tilemapTiledJSON('map1', 'src/assets/maps/tankMap.json');
  }
      
      
  
      
  create () {
    const map = this.createMap();
    const layers = this.createLayers(map);
    
    // Create objects
    tankP1 = this.physics.add.sprite(200, 200, 'tankP1');
    tankP1.direction = "up";
    unbreakable = this.physics.add.staticSprite(400, 400, 'unbreakable');
    tankP1.setCollideWorldBounds(true);

    // this.tweens.add({
    //     targets: logo,
    //     y: 450,
    //     duration: 2000,
    //     ease: "Power2",
    //     yoyo: true,
    //     loop: -1
    // });

    // Add groups for Bullet objects
    p1Bullets = this.physics.add.group({ key: "bullet" });
    // p2Bullets = this.physics.add.group(/*{ classType: Bullet, runChildUpdate: true }*/);
    // p3Bullets = this.physics.add.group(/*{ classType: Bullet, runChildUpdate: true }*/);
    // p4Bullets = this.physics.add.group(/*{ classType: Bullet, runChildUpdate: true }*/);

    
    // Sockets
    this.socket = io('http://localhost:3000') //this will need to change on prod server



    //SOCKETS
    let self = this;
    this.socket = io('http://localhost:3000') //this will need to change on prod server
    this.socket.on('connect', function() {
      console.log(`User: ... has connected`);
    });
    let payload = {
      x: 0,
      y: 0,
      name: "test",
      stuff: [1,2, "things", 451]
    }
    this.socket.emit('payloadDataTest', payload);
    /*
    

    this.socket.on('currentPlayers', (players) => {
      Object.keys(players).forEach((id) => {
        if (players[id].playerId === self.socket.id) {
          addPlayer(self, players[id]);
        }
      });
    });
    this.otherPlayers = this.physics.add.group();
    this.socket.on('currentPlayers', function (players) {
      Object.keys(players).forEach(function (id) {
        if (players[id].playerId === self.socket.id) {
          addPlayer(self, players[id]);
        } else {
          addOtherPlayers(self, players[id]);
        }
      });
    });

    this.socket.on('newPlayer', function (playerInfo) {
      addOtherPlayers(self, playerInfo);
    });

    this.socket.on('remove', function (playerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      });
    });

    // Add players
    function addPlayer(self, playerInfo) {
      self.tankP1 = self.physics.add.image(playerInfo.x, playerInfo.y, 'tankP1').setOrigin(0.5, 0.5).setDisplaySize(64, 64);
      // if (playerInfo.team === 'blue') {
      //   self.tankP1.setTint(0x0000ff);
      // } else {
      //   self.tankP1.setTint(0xff0000);
      // }
      self.tankP1.setDrag(100);
      self.tankP1.setAngularDrag(100);
      self.tankP1.setMaxVelocity(200);
    }

    function addOtherPlayers(self, playerInfo) {
      const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'tankP2').setOrigin(0.5, 0.5).setDisplaySize(64, 64);
      // if (playerInfo.team === 'blue') {
      //   otherPlayer.setTint(0x0000ff);
      // } else {
      //   otherPlayer.setTint(0xff0000);
      // }
      otherPlayer.playerId = playerInfo.playerId;
      self.otherPlayers.add(otherPlayer);
    }
    */
    

    // Input
    cursors = this.input.keyboard.createCursorKeys();
    /*
    this.socket.on('playerMoved', function (playerInfo) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setRotation(playerInfo.rotation);
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });
    */
    wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Collisions
    this.physics.add.collider(tankP1, unbreakable);
    this.physics.add.collider(tankP1, layers.wallLayer);
    this.physics.add.overlap(p1Bullets, unbreakable, destroyBullet, null, this);
    this.physics.add.collider(p1Bullets, layers.wallLayer, destroyBullet2);

  }

  update() {
      // Movement
      if (cursors.left.isDown || wasd.left.isDown) {
        console.log("left");
        tankP1.setVelocityX(-160);
        tankP1.setTexture('tankLeft');
        tankP1.direction = "left";
      }
      else if (cursors.right.isDown || wasd.right.isDown) {
        console.log("right");
        tankP1.setVelocityX(160);
        tankP1.setTexture('tankRight');
        tankP1.direction = "right";
      }
      else if (cursors.up.isDown || wasd.up.isDown) {
        console.log("up");
        tankP1.setVelocityY(-160);
        tankP1.setTexture('tankUp');
        tankP1.direction = "up";
      }
      else if (cursors.down.isDown || wasd.down.isDown) {
        console.log("down");
        tankP1.setVelocityY(160);
        tankP1.setTexture('tankDown');
        tankP1.direction = "down";
      }
      else if (Phaser.Input.Keyboard.JustDown(spacebar)) {
        console.log("shoot");
        let bullet = p1Bullets.create(tankP1.x, tankP1.y, 'bullet');
        if (tankP1.direction === "left") {
          bullet.setVelocityX(-600);
        }
        else if (tankP1.direction === "right") {
          bullet.setVelocityX(600);
        }
        else if (tankP1.direction === "up") {
          bullet.setVelocityY(-600);
        }
        else if (tankP1.direction === "down") {
          bullet.setVelocityY(600);
          bullet.allowGravity = false;
        }
      }
      else
      {
        tankP1.setVelocityX(0);
        tankP1.setVelocityY(0);
      }
      
    // let x = this.tankP1.x;
    // let y = this.tankP1.y;
    // let r = this.tankP1.rotation;
    // if (
    //   this.tankP1.oldPosition &&
    //   (x !== this.tankP1.oldPosition.x ||
    //     y !== this.tankP1.oldPosition.y ||
    //     r !== this.tankP1.oldPosition.rotation)
    // ) {
    //   this.socket.emit("playerMovement", {
    //     x: this.tankP1.x,
    //     y: this.tankP1.y,
    //     rotation: this.tankP1.rotation,
    //   });
    // }

    // // save old position data
    // this.tankP1.oldPosition = {
    //   x: this.tankP1.x,
    //   y: this.tankP1.y,
    //   rotation: this.tankP1.rotation,
    // };



      // Game Over
      if (gameOver === true) {
        return;
      }


  }

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

  
}
