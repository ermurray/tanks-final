import Phaser from 'phaser';
import Tank from './Tank';
import collidable from '../mixins/collidable';
import ProjectilesGroup from '../attacks/ProjectilesGroup';

export default class EnemyPlayer extends Tank {
  constructor(scene, x, y, key, socket, state, pNum) {
    super(scene, x, y, key);
    this.socket = socket;
    this.state = state;
    this.pNum = pNum;
    console.log("Initial State:", state);
    console.log("Socket", socket);
    this.init();
  }

  init() {
    this.lastDirection;
    this.direction;
    switch(this.pNum){
      case 'p1':
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        this.direction = 'right'
        break;
      case 'p2':
        this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
        this.direction = 'left'
      case 'p3':
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        this.direction = 'right'
        break;
      case 'p4':  
        this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
        this.direction = 'left'
        
    }
    this.setImmovable(true);
    this.setCollideWorldBounds(true);

    let enemyPlayer = this;
    this.socket.on('playerHasShot', function (data) {
      console.log(this)
      console.log(enemyPlayer);
      //console.log(enemyPlayers.projectilesGroup);
      enemyPlayer.projectilesGroup.fireProjectile(enemyPlayer);
    })

  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

  }
  update() {
    console.log(this.socket.data)
  }


}