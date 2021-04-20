import Phaser from 'phaser';
import collidable from '../mixins/collidable';


export default class Tank extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    //Mixins to assign other objects to this context
    Object.assign(this, collidable);
    
   
    this.playerSpeed = 100;
    this.enemySpeed =100;
    this.setBodySize(42, 42).setOffset(3,3);
    // this.setScale(0.9);
    this.depth = 3;
    this.hasBeenHit = false;
    this.health = 30;
    this.isAlive = true;

    
    this.setCollideWorldBounds(true);
    
  }

  static preload(scene) {
   scene.load.spritesheet('shoot', 'assets/shooting.png', 32, 32, 12);

  }

  playDamageTween() {
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 4,
      tint: 0xffffff 
    })
  }

  playMovementAnimation() {

  }

  playFireAnimation(){
      this.scene.anims.create({
        key: '',
        frames: [],
        skipMissedFrames: true,
        defaultTextureKey: null,
        startFrame: 0,
    
        // time
        delay: 0,
        frameRate: null,
        duration: null,
        timeScale: 1,
    
        // repeat
        repeat: 0,              // set to (-1) to repeat forever
        repeatDelay: 0,
        yoyo: false,
    
        // visible
        showOnStart: false,
        hideOnComplete: false
    });
  }

  playDeathAnimation(){
    // this.scene.tweens.add({
    //   targets: this,
    //   duration: 10
    // })
  }

  onHit() {
    this.health -= 10;
    this.playDamageTween();
    console.log("You've been hit!")
    console.log(`current hp: ${this.health}`)
    if(this.health <= 0){
      this.isAlive = false;
      this.onDeath();
    }
      
  }

  onDeath() {
    this.playDeathAnimation();
    console.log('disable this tank its dead',this.isAlive)
    let data = {
      id: this.socket.id,
      roomKey: this.state.roomKey,
      x: this.x,
      y: this.y,
      pnum: this.pNum,
    }
    this.socket.emit('playerDeath', data)
  }

}