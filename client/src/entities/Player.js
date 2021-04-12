import Phaser from 'phaser';
import collidable from '../mixins/collidable';
import ProjectilesGroup from '../attacks/ProjectilesGroup';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    //Mixins to assign other objects to this context
    Object.assign(this, collidable);

    this.init();
    this.initEvents();
  }

  init() {
    this.playerSpeed = 100;
    this.depth = this.y;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    this.projectilesGroup = new ProjectilesGroup(this.scene);
  
    this.setCollideWorldBounds(true);
    this.scene.input.keyboard.on('keydown-SPACE', () => {
      console.log('Shoot');
      this.projectilesGroup.fireProjectile(this);
    });

    this.wasd = {
      up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }

  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

  }
  update() {
    const { left, right , up, down, space} = this.cursors;
    
      if (left.isDown || this.wasd.left.isDown) {
        console.log("left");
        this.setVelocityX(-this.playerSpeed);
        this.setVelocityY(0)
        this.setTexture('tankLeft');
        this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
      }
      else if (right.isDown || this.wasd.right.isDown) {
        console.log("right");
        this.setVelocityX(this.playerSpeed);
        this.setVelocityY(0)
        this.setTexture('tankRight');
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
      }
      else if (up.isDown || this.wasd.up.isDown) {
        console.log("up");
        this.setVelocityY(-this.playerSpeed);
        this.setVelocityX(0)
        this.setTexture('tankUp');
        this.lastDirection = Phaser.Physics.Arcade.FACING_UP;
      }
      else if (down.isDown || this.wasd.down.isDown) {
        console.log("down");
        this.setVelocityY(this.playerSpeed);
        this.setVelocityX(0)
        this.setTexture('tankDown');
        this.lastDirection = Phaser.Physics.Arcade.FACING_DOWN;
      }
      else
      {
        this.setVelocityX(0);
        this.setVelocityY(0);
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
  }

  
}