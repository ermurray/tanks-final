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
    const player1 = this.createPlayer(100, 100);
    player1.setTexture('tankRight');
    const map = this.createMap();
    const layers = this.createLayers(map);
    player1.addCollider(layers.wallLayer);

    const player2 = this.createOtherPlayer(500, 500);
    player2.setTexture('tankLeft');
    player2.addCollider(layers.wallLayer);

    this.socket.on('playerMoved', function (data) {
      console.log(data.pName, data.x, data.y)
      player2.x = data.x;
      player2.y = data.y;
    })
    

    
    // this.socket.on('playerMoved', function (data) {
    //   // console.log("others players movement data:", data);
    //   console.log(data.pName, data.x, data.y)
    //   //const player2 = this.createPlayer(data.x, data.y)
    //   // createOtherPlayer(data.x, data.y);
    // })
    //const player2 = this.createOtherPlayer(this, data.x, data.y)


    
    // player1.projectilesGroup.addCollider(layers.wallLayer, player1.projectilesGroup.killAndHide);
    // this.physics.add.collider(player1.projectilesGroup, layers.wallLayer);

  } 

  update () {
    // this.socket.on('playerMoved', function (data) {
    //   console.log(data.pName, data.x, data.y)
    //   player2.x = data.x;
    //   player2.y = data.y;
    // })
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

  createPlayer(x,y) {
    return new Player(this,x,y, this.socket, this.state);
  }
  
  createOtherPlayer(x,y) {
    return new TestObject(this, x, y);
  }
  
}
