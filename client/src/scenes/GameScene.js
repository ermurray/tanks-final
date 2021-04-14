import {Scene} from 'phaser';
import io from 'socket.io-client';
import Player from '../entities/Player';
import TestObject from '../entities/TestObject'
import unbreakableBlock from '../assets/platform.png';



export default class GameScene extends Scene {

  constructor () {
      super("scene-game");
      
  }
            
  create () {
    this.socket = this.registry.get('socket');
    this.state = this.registry.get('state');
    const player1 = this.createPlayer();
    this.socket.on('playerMoved', function (data) {
      console.log("others players movement data:", data);
      const player2 = createOtherPlayer();
    })
    const player2 = this.createOtherPlayer(this, data.x, data.y)
    player1.setTexture('tankRight');
    const map = this.createMap();
    const layers = this.createLayers(map);
    
    player1.addCollider(layers.wallLayer);
    // player1.projectilesGroup.addCollider(layers.wallLayer, player1.projectilesGroup.killAndHide);
    // this.physics.add.collider(player1.projectilesGroup, layers.wallLayer);

  } 
  
  createMap() {
    const map = this.make.tilemap({key: 'map1'});
    map.addTilesetImage('rpl_grass', 'tilesGrass', 32, 32);
    map.addTilesetImage('rpl_sand','tilesSand', 32, 32);
   
    return map;
  }

  createLayers(map) {
    const tilesetGrass = map.getTileset('rpl_grass');
    const tilesetSand = map.getTileset('rpl_sand');
    const groundLayer = map.createLayer('background', [tilesetGrass, tilesetSand], 0, 0);
    const wallLayer = map.createLayer('blockedlayer', [tilesetGrass, tilesetSand], 0, 0);

    wallLayer.setCollisionByExclusion([-1]);
    groundLayer.setDepth(-1);
    return {groundLayer, wallLayer};

  }

  createPlayer() {
    return new Player(this,100,100, this.socket, this.state);
  }
  
  createOtherPlayer() {
    return new TestObject(this, x, y);
  }
  
}
