import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);


    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.maxSpeed = 300;
    this.speedX = 0;
    this.speedY = 0;
    this.maxDistanceX = 300;
    this.maxDistanceY = 300;
    this.traveledDistanceX = 0;
    this.traveledDistanceY = 0

  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.traveledDistanceX += this.body.deltaAbsX();
    this.traveledDistanceY += this.body.deltaAbsY();

    if (this.traveledDistanceX >= this.maxDistanceX) {
      this.body.reset(0,0);
      this.setActive(false);
      this.setVisible(false);
      this.traveledDistanceX = 0;
    }

    if (this.traveledDistanceY >= this.maxDistanceY) {
      this.body.reset(0,0);
      this.setActive(false);
      this.setVisible(false);
      this.traveledDistanceY = 0;
    }

  }

  fire(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.body.reset(x, y);
    this.setVelocityX(this.speedX);
    this.setVelocityY(this.speedY)
    console.log('Shoot a projectile');
  
  }
}