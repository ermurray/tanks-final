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

    this.projectilesGroup = new ProjectilesGroup(this.scene);
  
    this.setCollideWorldBounds(true);
    this.scene.input.keyboard.on('keydown-SPACE', () => {
      console.log('Shoot');
      this.projectilesGroup.fireProjectile(this);
    });

  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

  }
  update() {
    const { left, right , up, down, space, } = this.cursors;

      if (left.isDown) {
        console.log("left");
        this.setVelocityX(-this.playerSpeed);
        this.setVelocityY(0)
        this.setTexture('tankLeft');
        this.direction = "left";
      }
      else if (right.isDown) {
        console.log("right");
        this.setVelocityX(this.playerSpeed);
        this.setVelocityY(0)
        this.setTexture('tankRight');
        this.direction = "right";
      }
      else if (up.isDown) {
        console.log("up");
        this.setVelocityY(-this.playerSpeed);
        this.setVelocityX(0)
        this.setTexture('tankUp');
        this.direction = "up";
      }
      else if (down.isDown) {
        console.log("down");
        this.setVelocityY(this.playerSpeed);
        this.setVelocityX(0)
        this.setTexture('tankDown');
        this.direction = "down";
      }
      else
      {
        this.setVelocityX(0);
        this.setVelocityY(0);
      }
      // if (Phaser.Input.Keyboard.JustDown(space)) {
      //   console.log("shoot");
      //   // const bullet = this.scene.create(this.x, this.y, 'bullet');
      //   // if (this.direction === "left") {
      //   //   this.bullet.setVelocityX(-600);
      //   // }
      //   // else if (this.direction === "right") {
      //   //   this.bullet.setVelocityX(600);
      //   // }
      //   // else if (this.direction === "up") {
      //   //   this.bullet.setVelocityY(-600);
      //   // }
      //   // else if (this.direction === "down") {
      //   //   this.bullet.setVelocityY(600);
      //   //   this.bullet.allowGravity = false;
      //   // }
      // }
      
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