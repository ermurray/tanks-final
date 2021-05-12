import Phaser from 'phaser';
import Tank from './Tank';
import ProjectilesGroup from '../attacks/ProjectilesGroup';
import HealthBar from '../hud/HealthBar';
import initAnimations from '../animations/tankAnims'


export default class Player extends Tank {
  constructor(scene, x, y, key, socket, state, pNum) {
    super(scene, x, y, key);
    this.pNum = pNum
    this.socket = socket;
    this.state = state;
  
    
      this.init();
      this.initEvents()
  }

  init() {
    initAnimations(this.scene.anims);
    this.projectilesGroup = new ProjectilesGroup(this.scene, 'bullet');
    console.log("this is player Health", this.health)
    this.healthBar = new HealthBar( 
      this.scene, 
      this.scene.config.leftTopCorner.x + 33,
      this.scene.config.leftTopCorner.y + 5, 
      this.health
      );
    console.log("another health check", this.healthBar.hpValue)
    this.cursors = this.scene.input.keyboard.createCursorKeys();
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
    
    
    
    this.scene.input.keyboard.on('keydown-SPACE', () => {
      if(this.isAlive){
      // console.log('Shoot');
      this.projectilesGroup.fireProjectile(this);
      //Emit bullet data
      this.socket.emit("playerShoot", {
        x: this.x,
        y: this.y,
        direction: this.direction,
        roomKey: this.state.roomKey,
        socket: this.socket.id,
        pNum: this.pNum
      });
      }
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
    if(this.isAlive){
      
      
      
      if (left.isDown || this.wasd.left.isDown) {
        
        this.setVelocityX(-this.playerSpeed);
        this.setVelocityY(0);
        this.setAngle(180);
        this.direction = "left"
        this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
       
      }
      else if (right.isDown || this.wasd.right.isDown) {
      
        this.setVelocityX(this.playerSpeed);
        this.setVelocityY(0)
        this.setAngle(0);    
        this.direction = "right"
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
      }
      else if (up.isDown || this.wasd.up.isDown) {
        
        this.setVelocityY(-this.playerSpeed);
        this.setVelocityX(0)
        this.setAngle(-90) 
        this.direction = "up"
        this.lastDirection = Phaser.Physics.Arcade.FACING_UP;
      }
      else if (down.isDown || this.wasd.down.isDown) {
        
        this.setVelocityY(this.playerSpeed);
        this.setVelocityX(0)
        this.setAngle(90)   
        this.direction = "down"
        this.lastDirection = Phaser.Physics.Arcade.FACING_DOWN;
      }
      else
      {
        this.setVelocityX(0);
        this.setVelocityY(0);
        
      }
      
      // emit player movement
      let x = this.x;
      let y = this.y;
      let checkVelocityZero = this.body.velocity.equals({x:0, y:0}) 
      let currentDirection = this.direction;
      let currentVelocity = this.body.velocity;
      const movementData = {
        direction: currentDirection,
        x: this.x,
        y: this.y,
        vector2: currentVelocity,
        roomKey: this.state.roomKey,
        socket: this.socket.id,
        player: this.pNum
      }
      
      // if (
        //   this.oldPosition &&
        //   (x !== this.oldPosition.x ||
        //     y !== this.oldPosition.y)
        // ) {
          //   this.moving = true;
          if (this.body.velocity.equals({x:0, y:0})){
            this.direction = null
            this.moving = false;
            this.socket.emit("playerMovement",movementData)
          }
          
          // }
          
          
          if (!checkVelocityZero&&
            (this.oldDirection !== currentDirection)
            ) {    
              this.moving = true;
              this.socket.emit("playerMovement", movementData);
            }
            
            // save old position data
            // this.oldPosition = {
              //   x: this.x,
              //   y: this.y,
              // };
              this.oldDirection = this.direction
              this.oldVelocity = this.body.velocity
          if(!checkVelocityZero){
            this.scene.tankEngine.play();
          }
      // if (!checkVelocityZero){
      //    this.play('move', true)
      //   } else {this.play('move', false)}

    } else{
      this.body.stop(this);
      this.body.setImmovable(true);
      this.scene.setupSpectateCameraOn(this)
    }
            
            
  }
  
  

  
  
            
}