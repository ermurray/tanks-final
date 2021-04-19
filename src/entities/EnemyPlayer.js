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
    this.projectilesGroup = new ProjectilesGroup(this.scene, 'enemyBullet');
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

    let thisEnemy = this;
    let thisPlayer = this.pNum
    this.socket.on('playerHasShot', function (data) {
      
      if(data.pNum === thisPlayer){
        thisEnemy.projectilesGroup.fireProjectile(thisEnemy);
      
      }
      //// console.log(thisEnemys.projectilesGroup);
    })
    // this.remoteDirection;
    this.socket.on('playerMoved', function (data) {
    
      // console.log('enemy Moved', data)
     
      if(data.pNumber === thisPlayer){
        this.remoteDirection = data.direction
        // console.log("this player",data.direction)
        if (this.remoteDirection === 'left') {
              thisEnemy.setPosition(data.x, data.y)
              thisEnemy.setVelocityX(-thisEnemy.enemySpeed);
              thisEnemy.setVelocityY(0);
              thisEnemy.setAngle(180);
              thisEnemy.direction = "left"
              thisEnemy.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
    
        } else if (this.remoteDirection === 'right') {
              console.log("remoteright");
              thisEnemy.setPosition(data.x, data.y)
              thisEnemy.setVelocityX(thisEnemy.enemySpeed);
              thisEnemy.setVelocityY(0)
              thisEnemy.setAngle(0);    
              thisEnemy.direction = "right"
              thisEnemy.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        }else if (this.remoteDirection === 'up') {
              console.log("up");
              thisEnemy.setPosition(data.x, data.y)
              thisEnemy.setVelocityY(-thisEnemy.enemySpeed);
              thisEnemy.setVelocityX(0)
              thisEnemy.setAngle(-90) 
              thisEnemy.direction = "up"
              thisEnemy.lastDirection = Phaser.Physics.Arcade.FACING_UP;
            }
            else if (this.remoteDirection === 'down') {
              thisEnemy.setPosition(data.x, data.y)
              console.log("down");
              thisEnemy.setVelocityY(thisEnemy.enemySpeed);
              thisEnemy.setVelocityX(0)
              thisEnemy.setAngle(90)   
              thisEnemy.direction = "down"
              thisEnemy.lastDirection = Phaser.Physics.Arcade.FACING_DOWN;
            }
            else
            {
              thisEnemy.setPosition(data.x,data.y)
              thisEnemy.setVelocityX(0);
              thisEnemy.setVelocityY(0);
            }
      }
    });
    
     
   
  
    

  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    
  }
  update() {
    

   
  }

}