import Phaser from 'phaser';


export default class SpriteEffect extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x, y, effectName) {
    super(scene, x, y);

    scene.add.existing(this);
    scene.physics.add.existing(this);


    this.target = null;
    this.effectName = effectName;
  }

  locateEffect() {
    if (!this.target) {
      return;
    }
    const center = this.target.getCenter();
    this.body.reset(center.x, center.y)
  }

  playOn(target){
    this.target = target;
    this.play(this.effectName, true);
    this.locateEffect();
  }
}