import Phaser from 'phaser';
import Projectile from './Projectile';

export default class ProjectilesGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);


    this.createMultiple({
      frameQuantity: 10,
      active: false,
      visible: false,
      key: 'bullet',
      classType: Projectile
    })

  }

  fireProjectile(initiator) {
    const projectile = this.getFirstDead(false);
    if (!projectile) { return; }

    if (initiator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
      projectile.speed = Math.abs(projectile.speed);
      projectile.setFlipX(false)
    } else if ((initiator.lastDirection === Phaser.Physics.Arcade.FACING_LEFT)) {
      projectile.speed = -Math.abs(projectile.speed)
      projectile.setFlipX(true);
    } else if ((initiator.lastDirection === Phaser.Physics.Arcade.FACING_UP)) {
      projectile.speedY = -Math.abs(projectile.speed);
      projectile.speed = 0;
      projectile.setFlipY(false);

    } else if ((initiator.lastDirection === Phaser.Physics.Arcade.FACING_DOWN)){
      projectile.speedY = Math.abs(projectile.speed);
      projectile.speed = 0;
      projectile.setFlipY(true);
    }

    projectile.fire(initiator.x, initiator.y);

  }

}