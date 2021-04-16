import Phaser from 'phaser';
import collidable from '../mixins/collidable';
class EnemyPlayersGroup extends Phaser.GameObjects.Group {

  constructor(scene) {
    Object.assign(this, collidable)
  }



}