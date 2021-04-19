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
  
    this.Health = 30;

    
    this.setCollideWorldBounds(true);
    
  }



}