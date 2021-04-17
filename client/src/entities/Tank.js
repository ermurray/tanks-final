import Phaser from 'phaser';
import collidable from '../mixins/collidable';
import ProjectilesGroup from '../attacks/ProjectilesGroup';

export default class Tank extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    //Mixins to assign other objects to this context
    Object.assign(this, collidable);
    
   
    this.playerSpeed = 100;
    this.setBodySize(24, 24).setOffset(4, 4);
    // this.setScale(0.9);
    this.depth = 3;
  
    this.projectilesGroup = new ProjectilesGroup(this.scene);
    this.Health = 30;

    
    this.setCollideWorldBounds(true);
    
  }



}