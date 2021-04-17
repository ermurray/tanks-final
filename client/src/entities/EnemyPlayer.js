import Phaser from 'phaser';
import Tank from './Tank';
import collidable from '../mixins/collidable';
import ProjectilesGroup from '../attacks/ProjectilesGroup';

export default class EnemyPlayer extends Tank {
  constructor(scene, x, y, key, socket, state, pNum) {
    super(scene, x, y, key);
    this.socket = socket;
    this.state = state;
    this.pNum = pNum;
    console.log("Initial State:", state);
    console.log("Socket", socket);
    this.init();
  }

  init() {
    this.lastDirection;
    this.direction;
    switch(this.pNum){
      case 'p1':
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        this.setAngle(0)
        break;
      case 'p2':
        this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
        this.setAngle(180)
        break;
      case 'p3':
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
      
        this.setAngle(0)
        break;
      case 'p4':  
        this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
      
        this.setAngle(180)
        break;
        
    }
    this.setImmovable(true);
    this.setCollideWorldBounds(true);

    let enemyPlayer = this;
    this.socket.on('playerHasShot', function (data) {
      console.log(this)
      console.log(enemyPlayer);
      //console.log(enemyPlayers.projectilesGroup);
      enemyPlayer.projectilesGroup.fireProjectile(enemyPlayer);
    })

  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    
  }
  update() {
    

    // if (left.isDown || this.wasd.left.isDown) {
    //   console.log("left");
    //   this.setVelocityX(-this.playerSpeed);
    //   this.setVelocityY(0);
    //   this.setAngle(180);
    //   this.direction = "left"
    //   this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
    //   console.log('left velo check', this.body.velocity)
    // }
    // else if (right.isDown || this.wasd.right.isDown) {
    //   console.log("right");
    //   this.setVelocityX(this.playerSpeed);
    //   this.setVelocityY(0)
    //   this.setAngle(0);    
    //   this.direction = "right"
    //   this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    // }
    // else if (up.isDown || this.wasd.up.isDown) {
    //   console.log("up");
    //   this.setVelocityY(-this.playerSpeed);
    //   this.setVelocityX(0)
    //   this.setAngle(-90) 
    //   this.direction = "up"
    //   this.lastDirection = Phaser.Physics.Arcade.FACING_UP;
    // }
    // else if (down.isDown || this.wasd.down.isDown) {
    //   console.log("down");
    //   this.setVelocityY(this.playerSpeed);
    //   this.setVelocityX(0)
    //   this.setAngle(90)   
    //   this.direction = "down"
    //   this.lastDirection = Phaser.Physics.Arcade.FACING_DOWN;
    // }
    // else
    // {
    //   this.setVelocityX(0);
    //   this.setVelocityY(0);
    // }
  }


}