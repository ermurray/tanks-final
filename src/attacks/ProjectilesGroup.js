import Phaser from 'phaser';
import Projectile from './Projectile';
import { getTimeStamp } from '../utils/helpers'
import collidable from '../mixins/collidable';

export default class ProjectilesGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);


    this.createMultiple({
      frameQuantity: 10,
      active: false,
      visible: false,
      key: ['bullet','bulletUp'],
      classType: Projectile
    })

    this.timeFromlastFire = null;
    Object.assign(this, collidable);

  }

  fireProjectile(initiator) {
    const projectile = this.getFirstDead(false);
    const initiatorCenter = initiator.getCenter();
    let centerX;
    let centerY;

    
  
    if (!projectile) { return; }
    if (this.timeFromlastFire && this.timeFromlastFire + projectile.fireRate > getTimeStamp()) { return; }

    if (initiator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
      projectile.speedY = 0;
      projectile.speedX = Math.abs(projectile.maxSpeed);
      projectile.setTexture('bullet');
      projectile.setFlipX(false);
      projectile.setFlipY(false);
      centerX = initiatorCenter.x + 16;
      centerY = initiatorCenter.y;
    } else if ((initiator.lastDirection === Phaser.Physics.Arcade.FACING_LEFT)) {
      projectile.speedY = 0;
      projectile.speedX = -Math.abs(projectile.maxSpeed)
      projectile.setTexture('bullet');
      projectile.setFlipX(true);
      projectile.setFlipY(false);
      centerX = initiatorCenter.x - 16;
      centerY = initiatorCenter.y;
    } else if ((initiator.lastDirection === Phaser.Physics.Arcade.FACING_UP)) {
      projectile.speedX = 0;
      projectile.speedY = -Math.abs(projectile.maxSpeed);
      projectile.setTexture('bulletUp');
      projectile.setFlipX(false);
      projectile.setFlipY(false);
      centerX = initiatorCenter.x;
      centerY = initiatorCenter.y - 16;
    } else if ((initiator.lastDirection === Phaser.Physics.Arcade.FACING_DOWN)){
      projectile.speedX = 0;
      projectile.speedY = Math.abs(projectile.maxSpeed); 
      projectile.setTexture('bulletUp')
      projectile.setFlipX(false);  
      projectile.setFlipY(true); 
      centerX = initiatorCenter.x;
      centerY = initiatorCenter.y + 16;
    }

    projectile.fire(centerX, centerY);
    this.timeFromlastFire = getTimeStamp();

  }

}