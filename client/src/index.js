import Phaser from 'phaser';
import logoImg from './assets/Wartank.png';
import io from 'socket.io-client';

let logo;

class MyGame extends Phaser.Scene
{

    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('logo', logoImg);
    }
      
    create ()
    {
        logo = this.add.image(400, 150, 'logo');
      
        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });

        this.socket = io('http://localhost:3000') //this will need to change on prod server

        this.socket.on('connect', function() {
          console.log('this user is connected');
        });

        // cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // if (cursors.left.isDown)
        // {
        //     logo.setVelocityX(-160);
        // }
        // else if (cursors.right.isDown)
        // {
        //     logo.setVelocityX(160);
        // }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame
};

const game = new Phaser.Game(config);
