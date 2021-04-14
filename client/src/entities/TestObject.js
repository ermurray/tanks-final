import Phaser from 'phaser';
import collidable from '../mixins/collidable';
import ProjectilesGroup from '../attacks/ProjectilesGroup';

export default class TestObject extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    //Mixins to assign other objects to this context
    Object.assign(this, collidable);
    this.init();
    this.initEvents();
  }

  init() {
    this.playerSpeed = 100;
    this.depth = this.y;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    this.projectilesGroup = new ProjectilesGroup(this.scene);
  
    this.setCollideWorldBounds(true);

  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

  }
  update() {
    
  }

  
}