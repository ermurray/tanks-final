import Phaser from 'phaser';
import logoImg from './assets/Wartank.png';
import io from 'socket.io-client';
import tankBlue from './assets/tank-blue.png';
import tankGreen from './assets/tank-green.png';
import tankYellow from  './assets/tank-yellow.png';
import tankRed from  './assets/tank-red.png';
import unbreakableBlock from './assets/platform.png';
import tank_down from './assets/tank_down.png';
import tank_up from './assets/tank_up.png'
import tank_left from './assets/tank_left.png'
import tank_right from './assets/tank_right.png'

let logo;
let cursors;
let wasd;
let tankP1;
let tankP2;

let unbreakable;
let gameOver = false;

class MyGame extends Phaser.Scene
{

    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('logo', logoImg);
        this.load.image('tankP1', tankBlue);
        this.load.image('tankP2', tankRed);
      }
      
      
      create ()
      {
        
        let self = this;
        tankP1 = this.physics.add.sprite(50, 50, 'tankP1');
        tankP2 = this.physics.add.sprite(50, 50, 'tankP2');
        
        tankP1.setCollideWorldBounds(true);
        // logo.setBounce(0.2);
        
        //tankP2.setCollideWorldBounds(true);
        this.load.image('unbreakable', unbreakableBlock)
        this.load.image('tankUp', tank_up)
        this.load.image('tankDown', tank_down)
        this.load.image('tankLeft', tank_left)
        this.load.image('tankRight', tank_right)
    }
      
    create ()
    {
      let self = this
        //logo = this.physics.add.sprite(900, 500, 'logo');
        tankP1 = this.physics.add.sprite(50, 50, 'tankP1')
        unbreakable = this.physics.add.staticSprite(400, 400, 'unbreakable')
        // logo.setBounce(0.2);
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

        this.socket.on('disconnect', function (playerId) {
          self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerId === otherPlayer.playerId) {
              otherPlayer.destroy();
            }
          });
        });

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
        this.cursors = this.input.keyboard.createCursorKeys();
        // this.socket.on('playerMoved', function (playerInfo) {
        //   self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        //     if (playerInfo.playerId === otherPlayer.playerId) {
        //       otherPlayer.setRotation(playerInfo.rotation);
        //       otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        //     }
        //   });
        // });
        this.wasd = {
          up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
          down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }

        this.physics.add.collider(tankP1, unbreakable);

    }

    update() {
      if (this.tankP1) {
//         // emit player movement
//         let x = this.tankP1.x;
//         let y = this.tankP1.y;
//         let r = this.tankP1.rotation;
//         if (this.tankP1.oldPosition && (x !== this.tankP1.oldPosition.x || y !== this.tankP1.oldPosition.y || r !== this.tankP1.oldPosition.rotation)) {
//           this.socket.emit('playerMovement', { x: this.tankP1.x, y: this.tankP1.y, rotation: this.tankP1.rotation });
//         }
        
//         // save old position data
//         this.ship.oldPosition = {
//           x: this.ship.x,
//           y: this.ship.y,
//           rotation: this.ship.rotation
// };

        if (this.cursors.left.isDown || this.wasd.left.isDown)
        {
          this.tankP1.setVelocityX(-160);
          tankP1.setTexture('tankLeft')
          console.log("left");
        }
        else if (this.cursors.right.isDown || this.wasd.right.isDown)
        {
          this.tankP1.setVelocityX(160);
          tankP1.setTexture('tankRight')
          console.log("right");
        }
        else if (this.cursors.up.isDown || this.wasd.up.isDown)
        {
          this.tankP1.setVelocityY(-160);
          tankP1.setTexture('tankUp')
          console.log("up");
        }
        else if (this.cursors.down.isDown || this.wasd.down.isDown)
        {
          this.tankP1.setVelocityY(160);
          tankP1.setTexture('tankDown')
          console.log("down");
        }
        else
        {
          this.tankP1.setVelocityX(0);
          this.tankP1.setVelocityY(0);
        }
        if (gameOver === true) {
          return;
        }
      }
    }
  }
    
    const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1200,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
