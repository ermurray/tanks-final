import Phaser from 'phaser';
import logoImg from './assets/Wartank.png';
import io from 'socket.io-client';
import tankBlue from './assets/tank-blue.png';
import tankGreen from './assets/tank-green.png';
import tankYellow from  './assets/tank-yellow.png';
import tankRed from  './assets/tank-red.png';
import unbreakableBlock from './assets/platform.png';

let logo;
let cursors;
let wasd;
let tankP1;
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
        this.load.image('unbreakable', unbreakableBlock)
    }
      
    create ()
    {
        logo = this.physics.add.sprite(900, 500, 'logo');
        tankP1 = this.physics.add.sprite(50, 50, 'tankP1')
        unbreakable = this.physics.add.staticSprite(400, 400, 'unbreakable')
        // logo.setBounce(0.2);
        logo.setCollideWorldBounds(true);
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

        cursors = this.input.keyboard.createCursorKeys();

        wasd = {
          up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
          down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }

        this.physics.add.collider(tankP1, unbreakable);
    }

    update() {
        if (cursors.left.isDown || wasd.left.isDown)
        {
            tankP1.setVelocityX(-160);
            console.log("left");
        }
        else if (cursors.right.isDown || wasd.right.isDown)
        {
            tankP1.setVelocityX(160);
            console.log("right");
        }
        else if (cursors.up.isDown || wasd.up.isDown)
        {
          tankP1.setVelocityY(-160);
          console.log("up");
        }
        else if (cursors.down.isDown || wasd.down.isDown)
        {
          tankP1.setVelocityY(160);
          console.log("down");
        }
        else
        {
          tankP1.setVelocityX(0);
          tankP1.setVelocityY(0);
        }
        if (gameOver === true) {
          return;
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
