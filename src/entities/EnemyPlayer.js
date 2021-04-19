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
    
    this.init();
    this.initEvents();

  }

  init() {
    this.lastDirection;
    this.direction;
    this.positionX;
    this.positionY;
   
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
    // this.setImmovable(true);
    this.setCollideWorldBounds(true);

    let enemyPlayer = this;
    let thisPlayer = this.pNum
    this.socket.on('playerHasShot', function (data) {
      
      if(data.pNum === thisPlayer){
        enemyPlayer.projectilesGroup.fireProjectile(enemyPlayer);
      
      }
      //// console.log(enemyPlayers.projectilesGroup);
    })
    // this.remoteDirection;
    this.socket.on('playerMoved', function (data) {
    
      // console.log('enemy Moved', data)
     
      if(data.pNumber === thisPlayer){
        this.remoteDirection = data.direction
        // console.log("this player",data.direction)
        if (this.remoteDirection === 'left') {
              enemyPlayer.setPosition(data.x, data.y)
              enemyPlayer.setVelocityX(-enemyPlayer.enemySpeed);
              enemyPlayer.setVelocityY(0);
              enemyPlayer.setAngle(180);
              enemyPlayer.direction = "left"
              enemyPlayer.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
    
        } else if (this.remoteDirection === 'right') {
              console.log("remoteright");
              enemyPlayer.setPosition(data.x, data.y)
              enemyPlayer.setVelocityX(enemyPlayer.enemySpeed);
              enemyPlayer.setVelocityY(0)
              enemyPlayer.setAngle(0);    
              enemyPlayer.direction = "right"
              enemyPlayer.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        }else if (this.remoteDirection === 'up') {
              console.log("up");
              enemyPlayer.setPosition(data.x, data.y)
              enemyPlayer.setVelocityY(-enemyPlayer.enemySpeed);
              enemyPlayer.setVelocityX(0)
              enemyPlayer.setAngle(-90) 
              enemyPlayer.direction = "up"
              enemyPlayer.lastDirection = Phaser.Physics.Arcade.FACING_UP;
            }
            else if (this.remoteDirection === 'down') {
              enemyPlayer.setPosition(data.x, data.y)
              console.log("down");
              enemyPlayer.setVelocityY(enemyPlayer.enemySpeed);
              enemyPlayer.setVelocityX(0)
              enemyPlayer.setAngle(90)   
              enemyPlayer.direction = "down"
              enemyPlayer.lastDirection = Phaser.Physics.Arcade.FACING_DOWN;
            }
            else
            {
              enemyPlayer.setPosition(data.x,data.y)
              enemyPlayer.setVelocityX(0);
              enemyPlayer.setVelocityY(0);
            }
      }
    });
    
     
   
  
    

  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    
  }
  update() {
    
    // if(this.remoteDirection){
    //   // console.log("i am going left", this.remoteDirection)
    // }
    // // console.log("remote", this.remoteDirection)
    // if (enemyPlayer.remoteDirection === 'left') {
    //     // console.log("left");
    //     enemyPlayer.setVelocityX(-100);
    //     enemyPlayer.setVelocityY(0);
    //     enemyPlayer.setAngle(180);
    //     enemyPlayer.direction = "left"
    //     enemyPlayer.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
       
    //   }
    //   else if (enemyPlayer.remoteDirection === 'right') {
    //     // console.log("right");
    //     enemyPlayer.setVelocityX(100);
    //     enemyPlayer.setVelocityY(0)
    //     enemyPlayer.setAngle(0);    
    //     enemyPlayer.direction = "right"
    //     enemyPlayer.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    //   }
    //   else if (enemyPlayer.remoteDirection === 'up') {
    //     // console.log("up");
    //     enemyPlayer.setVelocityY(-100);
    //     enemyPlayer.setVelocityX(0)
    //     enemyPlayer.setAngle(-90) 
    //     enemyPlayer.direction = "up"
    //     enemyPlayer.lastDirection = Phaser.Physics.Arcade.FACING_UP;
    //   }
    //   else if (enemyPlayer.remoteDirection === 'down') {
    //     // console.log("down");
    //     enemyPlayer.setVelocityY(this.playerSpeed);
    //     enemyPlayer.setVelocityX(0)
    //     enemyPlayer.setAngle(90)   
    //     enemyPlayer.direction = "down"
    //     enemyPlayer.lastDirection = Phaser.Physics.Arcade.FACING_DOWN;
    //   }
    //   else
    //   {
    //     enemyPlayer.setVelocityX(0);
    //     enemyPlayer.setVelocityY(0);
    //   }
   
  }

}