import Phaser from 'phaser';
import collidable from '../mixins/collidable';
import ProjectilesGroup from '../attacks/ProjectilesGroup';

export default class EnemyPlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, socket, state, pNum) {
    super(scene, x, y, 'enemyPlayers');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    //Mixins to assign other objects to this context
    Object.assign(this, collidable);
    
    this.socket = socket;
    this.state = state;
    this.pNum = pNum;
    console.log("Initial State:", state);
    console.log("Socket", socket);
    this.init();
  }

  init() {
    this.playerSpeed = 100;
    this.depth = 3;
    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    this.projectilesGroup = new ProjectilesGroup(this.scene);
    this.Health = 30;
  
    this.setCollideWorldBounds(true);
   
  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

  }
  update() {
    console.log(this.socket.data)
  }


}