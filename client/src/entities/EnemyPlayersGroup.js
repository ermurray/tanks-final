import Phaser from 'phaser';
import collidable from '../mixins/collidable';


export default class EnemyPlayersGroup extends Phaser.GameObjects.Group {

  constructor(scene) {
    super(scene);
    Object.assign(this, collidable);
  }

  

}

