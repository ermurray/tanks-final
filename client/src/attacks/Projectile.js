import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);


    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 400;
    this.maxDistance = 300;
    this.traveledDistance = 0;

  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.traveledDistance += this.body.deltaAbsX();

    if (this.traveledDistance >= this.maxDistance) {
      this.destroy();
    }

  }

  fire() {
    console.log('Shoot a projectile');
    this.setVelocityX(this.speed)
  }
}