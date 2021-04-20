import Phaser from 'phaser';

export default class HealthBar {

  constructor(scene, x,y, health) {

    this.healthBar = new Phaser.GameObjects.Graphics(scene);
    this.healthBar.setScrollFactor(0,0);
    this.x = x;
    this.y = y;
    this.healthValue = health;

    this.size = {
      width: 60,
      height: 10
    }
    this.pixelPerHealth = this.size.width / this.healthValue;
    scene.add.existing(this.healthBar);
    this.draw(x,y)
  }

  draw(x, y) {
    this.healthBar.clear();
    const {width, height} = this.size;

    this.healthBar.fillStyle(0xa9a9a9, 1);
    this.healthBar.fillRect(x, y, width, height)
  }

}