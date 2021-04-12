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

    projectile.fire(initiator.x, initiator.y);

  }

}