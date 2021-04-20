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
  playDamageTween() {
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 4,
      tint: 0xffffff 
    })
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
    
    console.log('disable this tank its dead',this.isAlive)
    // this.socket = this.registry.get('socket');
    // let data = {
    //   id: this.socket.id,
    //   x: this.x,
    //   y: this.y,
      
    // }
    // this.socket.emit('playerDeath', data)
  }

}