import {Scene} from 'phaser';
import io from 'socket.io-client';
import Player from '../entities/Player';
import Bullet from '../entities/Bullet';
import EnemyPlayer from '../entities/EnemyPlayer';
import ProjectilesGroup from '../attacks/ProjectilesGroup';
import Projectile from '../attacks/Projectile'
import EnemyPlayersGroup from '../entities/EnemyPlayer';


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
    const thisScene = this;
    this.socket = this.registry.get('socket');
    this.state = this.registry.get('state');
    const map = this.createMap();
    const layers = this.createLayers(map);
    // console.log(layers.wallLayer.layer.data);
    const layerData = layers.wallLayer.layer.data;
    // console.log("layerData:",layerData)
    const playerSpawnZones = this.getPlayerZones(layers.spawnZone);
    
    const localPlayer = this.createPlayer(playerSpawnZones); 
   
    this.socket.on('playerHasBeenHit', (data)=>{
      console.log(`player at socket ${data} has been hit`)
    })
    //----------------------need to creat logic to create multiple enemy based on state.players obj for each player....
    const enemyPlayersArray = [];
    for(const player in thisScene.state.players ){
    if(player !== thisScene.socket.id){
      enemyPlayersArray.push(thisScene.state.players[player])
    }
  }
  
  
 
  
  const enemyPlayers = this.createEnemyPlayers(playerSpawnZones, enemyPlayersArray);
  
  // console.log("inside create------------->",enemyPlayers)
    
    
    
    this.physics.add.collider(localPlayer.projectilesGroup, layers.wallLayer, (projectile, wall) => {
      projectile.resetProjectile();
    });
    

  




    // Destructible box logic, may need refactoring
    let boxes = this.physics.add.group();
    
    boxes.create(600, 400, 'breakable').setScale(0.08);
    boxes.create(800, 400, 'breakable').setScale(0.08);
    boxes.create(500, 300, 'breakable').setScale(0.08);
    boxes.create(300, 200, 'breakable').setScale(0.08);
    boxes.create(700, 400, 'breakable').setScale(0.08);
    boxes.create(200, 500, 'breakable').setScale(0.08);
    boxes.create(200, 300, 'breakable').setScale(0.08);
    boxes.create(600, 300, 'breakable').setScale(0.08);
    boxes.create(400, 200, 'breakable').setScale(0.08);
    boxes.children.each((box) => {
      box.body.immovable = true;
      box.body.moves = false;

    })

   
    this.createLocalProjectileBoxCollisions(boxes, localPlayer.projectilesGroup);
    this.createEnemyProjectileBoxCollisions(boxes, enemyPlayers);
    this.createEnemyProjectileWallCollisions(layers.wallLayer, enemyPlayers);
    
    this.createEnemyProjectilePlayerCollisions(localPlayer, enemyPlayers);
    

    this.createPlayerColliders(localPlayer,{
      colliders:{
        wallLayer: layers.wallLayer,
        enemyPlayers,
        boxes
      }
    });

    this.createEnemyPlayersColliders(enemyPlayers, {
      colliders:{
        wallLayer: layers.wallLayer,
        localPlayer,
        boxes
      }
    })

    
   
  } 

//----------------end of create method of game scene------------------------------
  
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
  
  createPlayer(playerSpawnZones,) {
    //const pNumber = this.state.players[this.socket.id].pNumber;
    
    const { player1Spawn, player2Spawn, player3Spawn, player4Spawn } = playerSpawnZones
    const playerNum = this.state.players[this.socket.id].pNumber;
    let selectedSpawn;
    let playerColor;
    switch(playerNum){
      case 'p1':
        selectedSpawn = player1Spawn;
        playerColor = 'localPlayer'
        break;
      case 'p2':
        selectedSpawn = player2Spawn;
        playerColor = 'localPlayer'
        break;
      case 'p3':
        selectedSpawn = player3Spawn;
        playerColor = 'localPlayer'
        break;
      case 'p4':
        selectedSpawn = player4Spawn;
        playerColor = 'localPlayer'
        break;
    }

    return new Player(this, selectedSpawn.x, selectedSpawn.y, playerColor, this.socket, this.state, playerNum);
  }
  createEnemyPlayers(playerSpawnZones, enemyPlayersArray){
    
    return enemyPlayersArray.map(enemyPlayer => {
      return this.createEnemyPlayer(playerSpawnZones, enemyPlayer)
      
    });

  }
  createEnemyPlayer(playerSpawnZones, enemyPlayer){
    const { player1Spawn, player2Spawn, player3Spawn, player4Spawn } = playerSpawnZones
    let playerNum = enemyPlayer.pNumber;
    let selectedSpawn;
    let playerColor;
    switch(playerNum){
      case 'p1':
        selectedSpawn = player1Spawn;
        playerColor = 'tankBlue'
        break;
      case 'p2':
        selectedSpawn = player2Spawn;
        playerColor = 'tankRed'
        break;
      case 'p3':
        selectedSpawn = player3Spawn;
        playerColor = 'tankGreen'
        break;
      case 'p4':
        selectedSpawn = player4Spawn;
        playerColor = 'tankYellow'
        break;
    }
    return new EnemyPlayer(this, selectedSpawn.x, selectedSpawn.y, playerColor, this.socket, this.state, playerNum);
  }
  
  createEnemyPlayersColliders(enemyPlayers, { colliders }){
    enemyPlayers.forEach((enemyPlayer)=>{
      enemyPlayer
                .addCollider(colliders.wallLayer)
                .addCollider(colliders.localPlayer)
                .addCollider(colliders.boxes);

    })
      
  }
  createEnemyProjectileBoxCollisions(boxes, enemyPlayers){
    enemyPlayers.forEach((enemyPlayer) =>{
      this.physics.add.overlap(enemyPlayer.projectilesGroup, boxes, (projectile, box) => {
        box.destroy();
        projectile.resetProjectile();
  
      }, null, this);
    })

  }
  createEnemyProjectileWallCollisions(wallLayer, enemyPlayers){
    enemyPlayers.forEach((enemyPlayer) =>{
      this.physics.add.collider(enemyPlayer.projectilesGroup, wallLayer, (projectile,wall) => {
        projectile.resetProjectile();
  
      }, null, this);
    })
  }
  createEnemyProjectilePlayerCollisions(player, enemyPlayers){
    enemyPlayers.forEach((enemyPlayer) => {
      this.physics.add.overlap(enemyPlayer.projectilesGroup, player, (projectile, player) => {
        //projectile.resetProjectile();
        console.log("enemy projectile has collided with local player");
        let data = {
          socket: this.socket.id,
          roomKey: this.state.roomKey
        }
        this.socket.emit('playerHit', data)
        //projectile.resetProjectile();
      }, null, this);
    })

  }
  

  createLocalProjectileBoxCollisions(boxes, localProjectileGroup,){
    this.physics.add.overlap(localProjectileGroup, boxes, (projectile, box) => {
      box.destroy();
      projectile.resetProjectile();

    }, null, this);
  }

  

  createPlayerColliders(player, { colliders }){
    player
        .addCollider(colliders.wallLayer)
        .addCollider(colliders.enemyPlayers)
        .addCollider(colliders.boxes);
  }

  getPlayerZones(spawnZoneLayer){
    const playerSpawns = spawnZoneLayer.objects;
    return {
      player1Spawn: playerSpawns[0],
      player2Spawn: playerSpawns[1],
      player3Spawn: playerSpawns[2],
      player4Spawn: playerSpawns[3]
    }
  }

}
