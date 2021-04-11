import {Scene} from 'phaser';
import io from 'socket.io-client';
import tankBlue from '../assets/tank-blue.png';
import tankGreen from '../assets/tank-green.png';
import tankYellow from  '../assets/tank-yellow.png';
import tankRed from  '../assets/tank-red.png';
import unbreakableBlock from '../assets/platform.png';
import tank_down from '../assets/tank_down.png';
import tank_up from '../assets/tank_up.png';
import tank_left from '../assets/tank_left.png';
import tank_right from '../assets/tank_right.png';
import bullet from '../assets/bomb.png';

let logo;
let cursors;
let wasd;
let spacebar;
let tankP1;
let tankP2;

let p1Bullets;
let unbreakable;
let gameOver = false;

/*
var Bullet = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

  // Bullet Constructor
  function Bullet (scene)
  {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
      this.speed = 1;
      this.born = 0;
      this.direction = 0;
      this.xSpeed = 0;
      this.ySpeed = 0;
      this.setSize(12, 12, true);
  },

  // Fires a bullet from the player to the reticle
  fire: function (shooter, target)
  {
      this.setPosition(shooter.x, shooter.y); // Initial position
      this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

      // Calculate X and y velocity of bullet to moves it from shooter to target
      if (target.y >= this.y)
      {
          this.xSpeed = this.speed*Math.sin(this.direction);
          this.ySpeed = this.speed*Math.cos(this.direction);
      }
      else
      {
          this.xSpeed = -this.speed*Math.sin(this.direction);
          this.ySpeed = -this.speed*Math.cos(this.direction);
      }

      this.rotation = shooter.rotation; // angle bullet with shooters rotation
      this.born = 0; // Time since new bullet spawned
  },

  // Updates the position of the bullet each cycle
  update: function (time, delta)
  {
      this.x += this.xSpeed * delta;
      this.y += this.ySpeed * delta;
      this.born += delta;
      if (this.born > 1800)
      {
          this.setActive(false);
          this.setVisible(false);
      }
  }

});
*/

function destroyBullet (unbreakable, bullet) {
  bullet.disableBody(true, true);
}



export default class GameScene extends Scene {

  constructor () {
      super("scene-game");
  }


  preload () {
      this.load.image('tankP1', tankBlue);
      this.load.image('tankP2', tankRed);
      this.load.image('unbreakable', unbreakableBlock)
      this.load.image('tankUp', tank_up)
      this.load.image('tankDown', tank_down)
      this.load.image('tankLeft', tank_left)
      this.load.image('tankRight', tank_right)
      this.load.image('bullet', bullet)
  }
      
      
  
      
  create () {
    
    // Create objects
    // let self = this;
    //logo = this.physics.add.sprite(900, 500, 'logo');
    tankP1 = this.physics.add.sprite(200, 200, 'tankP1');
    tankP1.direction = "up";
    unbreakable = this.physics.add.staticSprite(400, 400, 'unbreakable');
    // logo.setBounce(0.2);;=
    // logo.setCollideWorldBounds(true);
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
    p1Bullets = this.physics.add.group({ key: "bullet" }/*{ classType: Bullet, runChildUpdate: true }*/);
    // p2Bullets = this.physics.add.group(/*{ classType: Bullet, runChildUpdate: true }*/);
    // p3Bullets = this.physics.add.group(/*{ classType: Bullet, runChildUpdate: true }*/);
    // p4Bullets = this.physics.add.group(/*{ classType: Bullet, runChildUpdate: true }*/);

    /*
    // Sockets
    this.socket = io('http://localhost:3000') //this will need to change on prod server

    this.socket.on('connect', function() {
      console.log(`User: .... has connected`);
    });

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
    // this.socket.on('playerMoved', function (playerInfo) {
    //   self.otherPlayers.getChildren().forEach(function (otherPlayer) {
    //     if (playerInfo.playerId === otherPlayer.playerId) {
    //       otherPlayer.setRotation(playerInfo.rotation);
    //       otherPlayer.setPosition(playerInfo.x, playerInfo.y);
    //     }
    //   });
    // });
    wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      // shoot: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Collisions
    this.physics.add.collider(tankP1, unbreakable);
    this.physics.add.overlap(p1Bullets, unbreakable, destroyBullet, null, this);

    // bullets = this.physics.add.group();

  }

  update() {
    // if (tankP1) {
//         // emit player movement
//         let x = tankP1.x;
//         let y = tankP1.y;
//         let r = tankP1.rotation;
//         if (tankP1.oldPosition && (x !== tankP1.oldPosition.x || y !== tankP1.oldPosition.y || r !== tankP1.oldPosition.rotation)) {
//           this.socket.emit('playerMovement', { x: tankP1.x, y: tankP1.y, rotation: tankP1.rotation });
//         }
      
//         // save old position data
//         this.ship.oldPosition = {
//           x: this.ship.x,
//           y: this.ship.y,
//           rotation: this.ship.rotation
// };

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
      
      // Game Over
      if (gameOver === true) {
        return;
      }
    // }
  }


}
