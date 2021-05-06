import Phaser from 'phaser';
import EffectManager from '../effects/EffectManager';
import SpriteEffect from '../effects/SpriteEffect';
import collidable from '../mixins/collidable';


export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);


    scene.add.existing(this);
    scene.physics.add.existing(this);
    //projectile speed 
    this.maxSpeed = 400;
    this.speedX = 0;
    this.speedY = 0;

    //projectile distance before inactive
    this.maxDistanceX = 400;
    this.maxDistanceY = 400;
    this.traveledDistanceX = 0;
    this.traveledDistanceY = 0;

    // projectile rate of fire and damage
    this.fireRate = 500;
    this.damage = 10;

    Object.assign(this, collidable);
    this.setBodySize(10,10)

    this.effectManager = new EffectManager(this.scene);

  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.traveledDistanceX += this.body.deltaAbsX();
    this.traveledDistanceY += this.body.deltaAbsY();

    if (this.traveledDistanceX >= this.maxDistanceX) {
      
      this.resetProjectile();
    }

    if (this.traveledDistanceY >= this.maxDistanceY) {
      this.resetProjectile();
    }

  }

  fire(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.body.reset(x, y);
    this.setVelocityX(this.speedX);
    this.setVelocityY(this.speedY);
    this.scene.shotFired.play();
    // console.log('Shoot a projectile');
  
  }
  hasHit(target){
    // const impactPosition = {x: this.x, y: this.y};
    this.scene.tankHit.play();
    this.resetProjectile();
    this.effectManager.playEffectOn('impact', target);
  }
  resetProjectile(){
    this.setActive(false);
    this.setVisible(false);
    this.body.reset(0,0);
    this.traveledDistanceX=0
    this.traveledDistanceY=0    
  }
}