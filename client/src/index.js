import Phaser from 'phaser';
import logoImg from './assets/Wartank.png';
import io from 'socket.io-client';
import tankBlue from './assets/tank-blue.png';
import tankGreen from './assets/tank-green.png';
import tankYellow from  './assets/tank-yellow.png';
import tankRed from  './assets/tank-red.png'

let logo;
let cursors;
let tankP1;

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
    }
      
    create ()
    {

      let self = this;

        logo = this.physics.add.sprite(50, 50, 'logo');
        //tankP1 = this.physics.add.sprite(50,50, 'tankP1')
        // logo.setBounce(0.2);
        logo.setCollideWorldBounds(true);
      
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

         function addPlayer(self, playerInfo) {
          self.tankP1 = self.physics.add.image(playerInfo.x, playerInfo.y, 'tankP1').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
          if (playerInfo.team === 'blue') {
            self.tankP1.setTint(0x0000ff);
          } else {
            self.tankP1.setTint(0xff0000);
          }
          self.tankP1.setDrag(100);
          self.tankP1.setAngularDrag(100);
          self.tankP1.setMaxVelocity(200);
        }

        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (cursors.left.isDown)
        {
            logo.setVelocityX(-160);
            console.log("left");
        }
        else if (cursors.right.isDown)
        {
            logo.setVelocityX(160);
            console.log("right");
        }
        else if (cursors.up.isDown)
        {
          logo.setVelocityY(-160);
          console.log("up");
        }
        else if (cursors.down.isDown)
        {
          logo.setVelocityY(160);
          console.log("down");
        }
        else
        {
          logo.setVelocityX(0);
          logo.setVelocityY(0);
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
