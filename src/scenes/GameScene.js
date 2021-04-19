import {Scene} from 'phaser';
import io from 'socket.io-client';
import Player from '../entities/Player';
import Bullet from '../entities/Bullet';
import EnemyPlayer from '../entities/EnemyPlayer';
import ProjectilesGroup from '../attacks/ProjectilesGroup';
import Projectile from '../attacks/Projectile'
import EnemyPlayersGroup from '../entities/EnemyPlayer';


export default class GameScene extends Scene {

  constructor (config) {
      super("scene-game");
      this.config = config;
  }

  /*
  preload () {
    this.load.image('box1', '../assets/boxes/1.png');
  }
  */
            
  create () {
    this.socket = this.registry.get('socket');
    this.state = this.registry.get('state');
    this.socket.emit('in-game',this.state);
    const thisScene = this;
    this.timerText = this.add.text(608,320,"Ready",{
      fill: "#00ff00",
      fontSize: "80px",
      fontStyle: "bold"
    })
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
    

  




    // Destructible box logic. Comment out different sections to try different box layouts.
    let boxes = this.physics.add.group();
    
        // for (let i = 0; i < layerData.length; i++) {
    //   for (let j = 0; j < layerData[i].length; j++) {
    //     if (layerData[i][j].index === -1) {
    //       let random = Math.random();
    //       if (random < 0.5) {
    //         // Couldn't use a loop here because boxes would overlap 3-4 times on each tile
    //         if (!(/*P1*/((layerData[i][j].x * 32 + 16) < (layers.spawnZone.objects[0].x + 64)) && 
    //         ((layerData[i][j].x * 32 + 16) > (layers.spawnZone.objects[0].x - 64)) && 
    //         ((layerData[i][j].y * 32 + 16) < (layers.spawnZone.objects[0].y + 64)) && 
    //         ((layerData[i][j].y * 32 + 16) > (layers.spawnZone.objects[0].y - 64)) || 
    //         /*P2*/((layerData[i][j].x * 32 + 16) < (layers.spawnZone.objects[1].x + 64)) && 
    //         ((layerData[i][j].x * 32 + 16) > (layers.spawnZone.objects[1].x - 64)) && 
    //         ((layerData[i][j].y * 32 + 16) < (layers.spawnZone.objects[1].y + 64)) && 
    //         ((layerData[i][j].y * 32 + 16) > (layers.spawnZone.objects[1].y - 64)) || 
    //         /*P3*/((layerData[i][j].x * 32 + 16) < (layers.spawnZone.objects[2].x + 64)) && 
    //         ((layerData[i][j].x * 32 + 16) > (layers.spawnZone.objects[2].x - 64)) && 
    //         ((layerData[i][j].y * 32 + 16) < (layers.spawnZone.objects[2].y + 64)) && 
    //         ((layerData[i][j].y * 32 + 16) > (layers.spawnZone.objects[2].y - 64)) || 
    //         /*P4*/((layerData[i][j].x * 32 + 16) < (layers.spawnZone.objects[3].x + 64)) && 
    //         ((layerData[i][j].x * 32 + 16) > (layers.spawnZone.objects[3].x - 64)) && 
    //         ((layerData[i][j].y * 32 + 16) < (layers.spawnZone.objects[3].y + 64)) && 
    //         ((layerData[i][j].y * 32 + 16) > (layers.spawnZone.objects[3].y - 64)))){
    //           let randomBox = Math.random();
    //           if (randomBox < 0.5) {
    //             boxes.create((layerData[i][j].x * 32 + 16), (layerData[i][j].y * 32 + 16), 'breakable').setScale(0.0625).setOrigin(0.5);
    //           } else {
    //             boxes.create((layerData[i][j].x * 32 + 16), (layerData[i][j].y * 32 + 16), 'breakable3').setScale(0.0625).setOrigin(0.5);
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    // for (let i = 0; i < layerData.length; i += 2) {
    //   for (let j = 0; j < layerData[i].length; j += 1) {
    //     if (layerData[i][j].index === -1) {
    //       if (!(/*P1*/((layerData[i][j].x * 32 + 16) < (layers.spawnZone.objects[0].x + 64)) && 
    //         ((layerData[i][j].x * 32 + 16) > (layers.spawnZone.objects[0].x - 64)) && 
    //         ((layerData[i][j].y * 32 + 16) < (layers.spawnZone.objects[0].y + 64)) && 
    //         ((layerData[i][j].y * 32 + 16) > (layers.spawnZone.objects[0].y - 64)) || 
    //         /*P2*/((layerData[i][j].x * 32 + 16) < (layers.spawnZone.objects[1].x + 64)) && 
    //         ((layerData[i][j].x * 32 + 16) > (layers.spawnZone.objects[1].x - 64)) && 
    //         ((layerData[i][j].y * 32 + 16) < (layers.spawnZone.objects[1].y + 64)) && 
    //         ((layerData[i][j].y * 32 + 16) > (layers.spawnZone.objects[1].y - 64)) || 
    //         /*P3*/((layerData[i][j].x * 32 + 16) < (layers.spawnZone.objects[2].x + 64)) && 
    //         ((layerData[i][j].x * 32 + 16) > (layers.spawnZone.objects[2].x - 64)) && 
    //         ((layerData[i][j].y * 32 + 16) < (layers.spawnZone.objects[2].y + 64)) && 
    //         ((layerData[i][j].y * 32 + 16) > (layers.spawnZone.objects[2].y - 64)) || 
    //         /*P4*/((layerData[i][j].x * 32 + 16) < (layers.spawnZone.objects[3].x + 64)) && 
    //         ((layerData[i][j].x * 32 + 16) > (layers.spawnZone.objects[3].x - 64)) && 
    //         ((layerData[i][j].y * 32 + 16) < (layers.spawnZone.objects[3].y + 64)) && 
    //         ((layerData[i][j].y * 32 + 16) > (layers.spawnZone.objects[3].y - 64)))){
    //           boxes.create((layerData[i][j].x * 32 + 16), (layerData[i][j].y * 32 + 16), 'breakable').setScale(0.0625).setOrigin(0.5);
    //       }
    //     }
    //   }
    // }
      
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
    this.createLocalProjectileEnemyCollisions(enemyPlayers, localPlayer.projectilesGroup)
    this.createEnemyProjectileBoxCollisions(boxes, enemyPlayers);
    this.createEnemyProjectileWallCollisions(layers.wallLayer, enemyPlayers);
    
    this.createEnemyProjectilePlayerCollisions(enemyPlayers, localPlayer);

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

    this.countDown(this.timerText, localPlayer);
   
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
        playerColor = 'player1'
        break;
      case 'p2':
        selectedSpawn = player2Spawn;
        playerColor = 'player2'
        break;
      case 'p3':
        selectedSpawn = player3Spawn;
        playerColor = 'player3'
        break;
      case 'p4':
        selectedSpawn = player4Spawn;
        playerColor = 'player4'
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
        playerColor = 'player1'
        break;
      case 'p2':
        selectedSpawn = player2Spawn;
        playerColor = 'player2'
        break;
      case 'p3':
        selectedSpawn = player3Spawn;
        playerColor = 'player3'
        break;
      case 'p4':
        selectedSpawn = player4Spawn;
        playerColor = 'player4'
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
  createEnemyProjectilePlayerCollisions(enemyPlayers, player){
    enemyPlayers.forEach((enemyPlayer) => {
      this.physics.add.collider(player, enemyPlayer.projectilesGroup, (player, projectile) => {
        
        projectile.resetProjectile();
        console.log("enemy projectile has collided with local player");
        let data = {
          socket: this.socket.id,
          roomKey: this.state.roomKey
        }
        this.socket.emit('playerHit', data)
      }, null, this);
    })
  }
  

  createLocalProjectileBoxCollisions(boxes, localProjectileGroup,){
    this.physics.add.overlap(localProjectileGroup, boxes, (projectile, box) => {
      box.destroy();
      projectile.resetProjectile();

    }, null, this);
  }

  createLocalProjectileEnemyCollisions(enemyPlayers, localProjectileGroup){
    enemyPlayers.forEach((enemyPlayer) =>{
      this.physics.add.overlap(localProjectileGroup, enemyPlayer, (enemyPlayer, projectile) => {
        projectile.resetProjectile();
        console.log("local projectile has collided with enemy player");
      }, null, this);
    })
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

  setupFollowCameraOn(player){
    const{ height, width, zoomfactor } = this.config;
    this.cameras.main.setBounds(0,0, width, height)
    this.cameras.main.startFollow(player).setZoom(zoomfactor);

  }

  countDown(text, localPlayer){
    let count = 4;
    let counter = setInterval(()=>{

      count -= 1;
      
      text.setText(`${count}...`)
      if(count < 1){
        this.scene.resume('scene-game');
        clearInterval(counter);
        text.destroy();
        this.setupFollowCameraOn(localPlayer);
      } 

    },1000)
  }
}
