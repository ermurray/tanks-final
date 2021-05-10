import Phaser from 'phaser';

export default class HealthBar {

  constructor(scene, x,y, health) {

    this.healthBar = new Phaser.GameObjects.Graphics(scene);
    this.healthBar.setScrollFactor(0,0);
    this.x = x;
    this.y = y;
    this.hpValue = health;
    this.healthBar.setVisible(false);
    
  

    this.size = {
      width: 90,
      height: 10
    }
    this.pixelPerHp = this.size.width / this.hpValue;
    scene.add.existing(this.healthBar);
    this.draw(x,y);
  }
  decreaseHealth(ammount) {
    this.hpValue -= ammount;
    this.draw(this.x, this.y);
  }
  
  increaseHealth(ammount){
    this.hpValue += ammount;
    this.draw(this.x, this.y);
  }

  draw(x, y) {
    this.healthBar.clear();
    const {width, height} = this.size;
    const margin = 2;
    this.healthBar.fillStyle(0xFF0000, 1);
    this.healthBar.fillRect(x, y, width, height)
    console.log("this is the health value",this.hpValue)
     this.hpWidth = Math.floor(this.hpValue * this.pixelPerHp);
    console.log("THis is the width",this.hpWidth);
    this.healthBar.fillStyle(0x00FF00, 1);
    this.healthBar.fillRect(x, y, this.hpWidth, height)

  }
  showHealthBar(){
    this.healthBar.setVisible(true);
  }
  hideHealthBar(){
    this.healthBar.setVisible(false);
  }
}