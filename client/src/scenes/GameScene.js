import {Scene} from 'phaser';
import io from 'socket.io-client';
import Player from '../entities/Player';



export default class GameScene extends Scene {

  constructor () {
      super("scene-game");
      
  }
            
  create () {
    this.socket = this.registry.get('socket');
    this.state = this.registry.get('state');
    const map = this.createMap();
    const layers = this.createLayers(map);
    const playerSpawnZones = this.getPlayerZones(layers.spawnZone);
    const player1 = this.createPlayer(playerSpawnZones);
    console.log("layer--->",layers.spawnZone)
    player1.setTexture('tankRight');
    
    // player1.addCollider(layers.wallLayer);
    // player1.projectilesGroup.addCollider(layers.wallLayer, player1.projectilesGroup.killAndHide);
    // this.physics.add.collider(player1.projectilesGroup, layers.wallLayer);
    this.createPlayerColliders(player1,{
      colliders:{
        wallLayer: layers.wallLayer
      }
    });

    
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
    const spawnZone = map.getObjectLayer('player_start');
      //need to add collision specific layer to tile map independent of wall layer.
    wallLayer.setCollisionByExclusion([-1]);
    groundLayer.setDepth(-1);
    return {groundLayer, wallLayer, spawnZone};

  }

  createPlayer(playerSpawnZones) {
    const { player1Spawn } = playerSpawnZones
    return new Player(this, player1Spawn.x, player1Spawn.y, this.socket, this.state);
  }
  createEnemyPlayer(){

  }
  createPlayerColliders(player, { colliders }){
    player.addCollider(colliders.wallLayer);
  }
  getPlayerZones(spawnZoneLayer){
    console.log("zones --->",spawnZoneLayer);
    const playerSpawns = spawnZoneLayer.objects;
    return {
      player1Spawn: playerSpawns[0],
      player2Spawn: playerSpawns[1],
      player3Spawn: playerSpawns[2],
      player4Spawn: playerSpawns[3]
    }
  }
  createOtherPlayer() {
    
  }
}
