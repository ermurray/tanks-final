import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);


    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 600;
  }

  fire() {
    console.log('Shoot a projectile');
    this.setVelocityX(this.speed)
  }
}