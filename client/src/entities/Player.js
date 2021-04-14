import Phaser from 'phaser';
import collidable from '../mixins/collidable';
import ProjectilesGroup from '../attacks/ProjectilesGroup';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, socket) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    //Mixins to assign other objects to this context
    Object.assign(this, collidable);
    this.socket = socket;
    this.init();
    this.initEvents();
  }

  init() {
    this.playerSpeed = 100;
    this.depth = this.y;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    this.projectilesGroup = new ProjectilesGroup(this.scene);
    this.playerHealth = 30;
  
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
        console.log('leftkey',this.socket);
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
  }

  
}