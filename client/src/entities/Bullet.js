import Phaser from 'phaser';
import collidable from '../mixins/collidable';
import ProjectilesGroup from '../attacks/ProjectilesGroup';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, direction) {
    super(scene, x, y, 'bullet');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.x = x;
    this.y = y;
    this.direction = direction;
    //Mixins to assign other objects to this context
    Object.assign(this, collidable);
    this.init();
  }

  init() {
    switch(this.direction) {
      case "left":
        this.setVelocityX(-400);
        break;
      case "right":
        this.setVelocityX(400);
        break;
      case "up":
        this.setVelocityY(-400);
        break;
      case "down":
        this.setVelocityY(400);
    }
    
    this.projectilesGroup = new ProjectilesGroup(this.scene);
  
  
    this.setCollideWorldBounds(true);
   
  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

  }
  update() {
  }


}