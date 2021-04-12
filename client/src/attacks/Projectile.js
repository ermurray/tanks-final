import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);


    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 400;
    this.speedY = 0;
    this.maxDistance = 300;
    this.traveledDistance = 0;

  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.traveledDistance += this.body.deltaAbsX();

    if (this.traveledDistance >= this.maxDistance) {
      this.setActive(false);
      this.setVisible(false);
      this.traveledDistance = 0;
    }

  }

  fire(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.body.reset(x, y);
    this.setVelocityX(this.speed);
    this.setVelocityY(this.speedY);
    console.log('Shoot a projectile');
  }
}