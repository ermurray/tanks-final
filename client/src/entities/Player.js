import Phaser from 'phaser';


export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.init();
    this.initEvents();
  }

  init() {
    this.playerSpeed = 100;
    this.depth = this.y;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    // this.wasd = {
    //   up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    //   down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    //   left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    //   right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    //   // shoot: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    // }
    this.setCollideWorldBounds(true);
  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

  }
  update() {
    this.setDepth(2);
    const { left, right , up, down} = this.cursors;
      if (left.isDown) {
        console.log("left");
        this.setVelocityX(-this.playerSpeed);
        this.setTexture('tankLeft');
        this.direction = "left";
      }
      else if (right.isDown) {
        console.log("right");
        this.setVelocityX(this.playerSpeed);
        this.setTexture('tankRight');
        this.direction = "right";
      }
      else if (up.isDown) {
        console.log("up");
        this.setVelocityY(-this.playerSpeed);
        this.setTexture('tankUp');
        this.direction = "up";
      }
      else if (down.isDown) {
        console.log("down");
        this.setVelocityY(this.playerSpeed);
        this.setTexture('tankDown');
        this.direction = "down";
      }
      // else if (Phaser.Input.Keyboard.JustDown(spacebar)) {
      //   console.log("shoot");
      //   let bullet = p1Bullets.create(this.player.x, this.player.y, 'bullet');
      //   if (this.player.direction === "left") {
      //     bullet.setVelocityX(-600);
      //   }
      //   else if (this.player.direction === "right") {
      //     bullet.setVelocityX(600);
      //   }
      //   else if (this.player.direction === "up") {
      //     bullet.setVelocityY(-600);
      //   }
      //   else if (this.player.direction === "down") {
      //     bullet.setVelocityY(600);
      //     bullet.allowGravity = false;
      //   }
      // }
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