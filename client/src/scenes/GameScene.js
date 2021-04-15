import {Scene} from 'phaser';
import io from 'socket.io-client';
import Player from '../entities/Player';
import EnemyPlayer from '../entities/EnemyPlayer';


export default class GameScene extends Scene {

  constructor () {
      super("scene-game");
      
  }

  /*
  preload () {
    this.load.image('box1', '../assets/boxes/1.png');
  }
  */
            
  create () {
    this.socket = this.registry.get('socket');
    this.state = this.registry.get('state');
    const map = this.createMap();
    const layers = this.createLayers(map);
    const playerSpawnZones = this.getPlayerZones(layers.spawnZone);
    
    const localPlayer = this.createPlayer(playerSpawnZones); 
    console.log("layer--->",layers.spawnZone)
  
    this.createPlayerColliders(localPlayer,{
      colliders:{
        wallLayer: layers.wallLayer
      }
    });
    //----------------------need to creat logic to create multiple enemy base on state.players obj for each player....
    const enemyPlayer = this.createEnemyPlayer(playerSpawnZones);

    this.createEnemyPlayerColliders(enemyPlayer, {
      colliders:{
        wallLayer: layers.wallLayer
      }
    })

    this.physics.add.collider(localPlayer.projectilesGroup, layers.wallLayer, (projectile, wall) => {
      projectile.resetProjectile();
    });

    // Destructible box logic, may need refactoring
    let boxes = this.physics.add.group();
    boxes.create(600, 400, 'breakable').setScale(0.08);
    boxes.create(800, 400, 'breakable').setScale(0.08);
    boxes.children.each((box) => {
      box.body.immovable = true;
      box.body.moves = false;
    })

    localPlayer.addCollider(boxes);

    this.physics.add.overlap(localPlayer.projectilesGroup, boxes, (projectile, box) => {
      box.destroy();
      projectile.resetProjectile();

    }, null, this);


    this.socket.on('playerMoved', function (data) {
      console.log("Enemy players movement data:", data);
    })

    
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
    const { player1Spawn, player2Spawn, player3Spawn, player4Spawn } = playerSpawnZones
    return new Player(this, player1Spawn.x, player1Spawn.y, this.socket, this.state);
  }

  createEnemyPlayer(playerSpawnZones){
    const { player1Spawn, player2Spawn, player3Spawn, player4Spawn } = playerSpawnZones
    return new EnemyPlayer(this, player2Spawn.x, player1Spawn.y, this.socket, this.state);
  }
  createEnemyPlayerColliders(player, { colliders }){
    player.addCollider(colliders.wallLayer);
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

}
