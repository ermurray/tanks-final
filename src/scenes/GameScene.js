import {Scene} from 'phaser';
import io from 'socket.io-client';
import Player from '../entities/Player';
import Bullet from '../entities/Bullet';
import EnemyPlayer from '../entities/EnemyPlayer';
import ProjectilesGroup from '../attacks/ProjectilesGroup';
import Projectile from '../attacks/Projectile'
import EnemyPlayersGroup from '../entities/EnemyPlayer';
import initObjAnimations from '../animations/staticObjAnims';
import initHitAnimations from '../animations/hitAnims';


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
    this.scene.bringToTop('scene-game');
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const thisScene = this;
    this.timerText = this.add.text(screenCenterX, screenCenterY, "Ready", {
      fill: "#00ff00",
      fontSize: "80px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    }).setDepth(2).setOrigin(0.5);
    //map creation and layout
    const map = this.createMap();
    const layers = this.createLayers(map);
    initObjAnimations(this.anims)
    initHitAnimations(this.anims)
    const hearts = this.createHearts(layers.heartLayer)
    const woodBoxes = this.createWoodBoxes(layers.boxWoodLayer);
    const greyBoxes = this.createGreyBoxes(layers.boxGreyLayer);
    // console.log(layers.wallLayer.layer.data);
    const layerData = layers.wallLayer.layer.data;
   
    // this.add.image(0,0, 'overlay').setOrigin(0).setAlpha(0.5);



    const playerSpawnZones = this.getPlayerZones(layers.spawnZone);
    
    const localPlayer = this.createPlayer(playerSpawnZones); 
    
    this.socket.on('playerHasBeenHit', (data)=>{
      
      console.log(`player at socket ${data} has been hit`)
    })
    this.socket.on('playerHasDied', (data)=>{
      console.log(`player at socket ${data.id} has been killed`)
      console.log(`render explosion animation at ${data.x, data.y}`)
    })
    //----------------------need to creat logic to create multiple enemy based on state.players obj for each player....
    const enemyPlayersArray = [];
    for(const player in thisScene.state.players ){
      if(player !== thisScene.socket.id){
        enemyPlayersArray.push(thisScene.state.players[player])
      }
    }
    this.overlay = this.add.image(0,0, 'overlay').setOrigin(0).setDepth(3).setAlpha(0.1);
    // this.lights.enable().setAmbientColor(0x333333)
    // this.overlay.setPipeline('Light2D')
    // const light = this.lights.addLight(180, 80, 200).setColor(0xffffff).setIntensity(2);

    // //  Track the pointer
    // this.input.on('pointermove', function (pointer) {

    //     light.x = pointer.x;
    //     light.y = pointer.y;
    // });

    let gameOver = false;
    
    
    const enemyPlayers = this.createEnemyPlayers(playerSpawnZones, enemyPlayersArray);
   
  
  // console.log("inside create------------->",enemyPlayers)
    
    
    
    this.physics.add.collider(localPlayer.projectilesGroup, layers.wallLayer, (projectile, wall) => {
      projectile.resetProjectile();
    });
    

    woodBoxes.children.each((box) => {
      box.body.immovable = true;
      box.body.moves = false;
      
    })

    greyBoxes.children.each((box)=>{
      box.body.immovable = true;
      box.body.moves = false;

    })
    
    this.createLocalProjectileBoxCollisions(woodBoxes, localPlayer.projectilesGroup);
    this.createLocalProjectileBoxCollisions(greyBoxes, localPlayer.projectilesGroup);

    this.createLocalProjectileEnemyCollisions(enemyPlayers, localPlayer.projectilesGroup)
    this.createEnemyProjectileBoxCollisions(woodBoxes, enemyPlayers);
    this.createEnemyProjectileBoxCollisions(greyBoxes, enemyPlayers);
    this.createEnemyProjectileWallCollisions(layers.wallLayer, enemyPlayers);
    
    this.createEnemyProjectilePlayerCollisions(enemyPlayers, localPlayer);

    this.createPlayerColliders(localPlayer,{
      colliders:{
        wallLayer: layers.wallLayer,
        enemyPlayers,
        woodBoxes,
        greyBoxes
      }
    });

    this.createEnemyPlayersColliders(enemyPlayers, {
      colliders:{
        wallLayer: layers.wallLayer,
        localPlayer,
        woodBoxes,
        greyBoxes
      }
    })


    


    this.countDown(this.timerText, localPlayer);
   
  } 

//----------------end of create method of game scene------------------------------
  
  createMap() {
    const map = this.make.tilemap({key: 'map1'});
    map.addTilesetImage('rpl_grass', 'tilesGrass', 32, 32);
    map.addTilesetImage('rpl_sand','tilesSand', 32, 32);
    map.addTilesetImage('rpl_paths-export', 'tilesPaths', 32, 32);
   
    return map;
  }
  
  createLayers(map) {
    const tilesetGrass = map.getTileset('rpl_grass');
    const tilesetSand = map.getTileset('rpl_sand');
    const tilesetPaths = map.getTileset('rpl_paths-export');
    const groundLayer = map.createLayer('background', [tilesetGrass, tilesetSand, tilesetPaths], 0, 0);
    const wallLayer = map.createLayer('blockedlayer', [tilesetGrass, tilesetSand], 0, 0);
    const spawnZone = map.getObjectLayer('player_start');
    const heartLayer = map.getObjectLayer('health_power');
    const boxWoodLayer = map.getObjectLayer('box1_spawns');
    const boxGreyLayer = map.getObjectLayer('box2_spawns');
      //need to add collision specific layer to tile map independent of wall layer.
    wallLayer.setCollisionByExclusion([-1]);
    groundLayer.setDepth(-1);
    return {
      groundLayer, 
      wallLayer, 
      spawnZone, 
      boxWoodLayer, 
      boxGreyLayer,
      heartLayer
    };

  }

  createWoodBoxes(boxLayer) {
    const boxes = this.physics.add.group();
    boxLayer.objects.forEach(box => {
      boxes.get(box.x + 24, box.y -24, 'woodBox');
      
    })
    return boxes
  }
  createGreyBoxes(boxLayer) {
    const boxes = this.physics.add.group();
    boxLayer.objects.forEach(box => {
      boxes.get(box.x + 24, box.y -24, 'greyBox');
     
    })
    
    return boxes
  }

  createHearts(heartLayer){
    const hearts = this.physics.add.group();
    heartLayer.objects.forEach(heart => {
      hearts.get(heart.x +16, heart.y -16,'hearts')
    })
    hearts.playAnimation('heartRotate')
    return hearts
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
        playerColor = 'blue_tank_spritesheet'
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
                .addCollider(colliders.woodBoxes)
                .addCollider(colliders.greyBoxes);


    })
      
  }
  createEnemyProjectileBoxCollisions(boxes, enemyPlayers){
    enemyPlayers.forEach((enemyPlayer) =>{
      this.physics.add.overlap(enemyPlayer.projectilesGroup, boxes, (projectile, box) => {
      
       //this.play('boxDestroy', true)
        // box.destroy();
        projectile.hasHit(box);
        box.play('boxDestroy', true)
        box.body.checkCollision.none = true;
        setTimeout(()=>{
          this.add.tween({
            targets: box,
            alpha: 0,
            duration: 2000,
            ease: 'Power3'
          })
        }, 100)
        
        
       
      }, null, this);
    })

  }

  

  createEnemyProjectileWallCollisions(wallLayer, enemyPlayers){
    enemyPlayers.forEach((enemyPlayer) =>{
      this.physics.add.collider(enemyPlayer.projectilesGroup, wallLayer, (projectile, wall) => {
        projectile.resetProjectile();
  
      }, null, this);
    })
  }
  createEnemyProjectilePlayerCollisions(enemyPlayers, player){
    enemyPlayers.forEach((enemyPlayer) => {
      this.physics.add.collider(player, enemyPlayer.projectilesGroup, (player, projectile) => {
        console.log("projectile.damage",projectile.damage)
        player.healthBar
        player.onHit(projectile.damage);
        projectile.hasHit(player);
        console.log("enemy projectile has collided with local player");
        let data = {
          socket: this.socket.id,
          roomKey: this.state.roomKey
        }
        this.socket.emit('playerHit', data);
        this.endGame(true);
      }, null, this);
    })
    
  }
  

  createLocalProjectileBoxCollisions(boxes, localProjectileGroup,){
    this.physics.add.overlap(localProjectileGroup, boxes, (projectile, box) => {
      
      projectile.hasHit(box);
      setTimeout(()=>{
        box.play('boxDestroy')

      },0)
      box.body.checkCollision.none = true;
      
      setTimeout(()=>{
        this.add.tween({
          targets: box,
          alpha: 0,
          duration: 2000,
          ease: 'Power3'
        })
      }, 300)
      // projectile.resetProjectile();
      
    }, null, this);
  }

  createLocalProjectileEnemyCollisions(enemyPlayers, localProjectileGroup){
    enemyPlayers.forEach((enemyPlayer) =>{
      this.physics.add.overlap(localProjectileGroup, enemyPlayer, (enemyPlayer, projectile) => {
        projectile.hasHit(enemyPlayer);
        console.log("local projectile has collided with enemy player");
        this.socket.on('playerHasBeenHit', (data)=>{
          enemyPlayer.playDamageTween();
          
          console.log(`player at socket ${data} has been hit`)
        })
     
        this.socket.on('playerHasDied', (data) => {
          console.log(`render explosion animation at ${data.x, data.y}`)
          enemyPlayer.body.stop(this);
          enemyPlayer.body.setImmovable(true);
        })
        this.endGame(true);
      }, null, this);
    })
  }

  

  createPlayerColliders(player, { colliders }){
    player
        .addCollider(colliders.wallLayer)
        .addCollider(colliders.enemyPlayers)
        .addCollider(colliders.woodBoxes)
        .addCollider(colliders.greyBoxes);
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
    const{ height, width, zoomfactor, leftTopCorner } = this.config;
    this.frame = this.add.image(leftTopCorner.x, leftTopCorner.y, 'frame').setOrigin(0).setDepth(1).setScrollFactor(0,0).setAlpha(-5);
    this.add.image(leftTopCorner.x, leftTopCorner.y, 'hud').setOrigin(0).setDepth(1).setScrollFactor(0,0);
  
    this.cameras.main.setBounds(0,0, width, height)
    this.cameras.main.startFollow(player).zoomTo(zoomfactor, 750);
    console.log("localplayer??????",player.healthBar)
    player.healthBar.showHealthBar();
    this.cameras.main.setBackgroundColor(0x888076)
    this.playersRemainText = this.add.text(leftTopCorner.x + 275 , leftTopCorner.y + 5, `PLAYERS REMAINING: `, {
      fill: "#000000",
      fontSize: '16px',
      fontStyle: 'bold',
      fontFamily: 'Pixelar',
      fill: "#00ff00",
    }).setOrigin(0,0).setDepth(4).setScrollFactor(0,0);
    this.timerText = this.add.text(leftTopCorner.x + 565 , leftTopCorner.y + 5, `GAME TIMER: `, {
      fill: "#000000",
      fontSize: '16px',
      fontStyle: 'bold',
      fontFamily: 'Pixelar',
      fill: "#00ff00",
    }).setOrigin(0,0).setDepth(4).setScrollFactor(0,0);
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
        setTimeout(()=>{

          this.tweens.add({
            targets: this.frame,
            alpha: 1,
            duration: 2000,
            ease: 'Power3'
  
          })
        },1000)
      } 

    },1000)
  }

  endGame(gameOver) {
    if (gameOver === true) {
      this.scene.setActive(true, 'scene-gameover');
      this.scene.bringToTop('scene-gameover');
    }

  }
}
