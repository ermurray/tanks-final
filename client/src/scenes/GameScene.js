import {Scene} from 'phaser';
import io from 'socket.io-client';
import Player from '../entities/Player';
import unbreakableBlock from '../assets/platform.png';
import box1 from '../assets/boxes/1.png'



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
    const player1 = this.createPlayer();
    player1.setTexture('tankRight');
    const map = this.createMap();
    const layers = this.createLayers(map);
    
    player1.addCollider(layers.wallLayer);
    console.log(player1.projectilesGroup.children.entries);
    /*
    for (let i = 0; i < player1.projectilesGroup.children.entries.length; i++) {
      player1.projectilesGroup.addCollider(layers.wallLayer, player1.projectilesGroup.killAndHide);
    }
    */

    this.physics.add.collider(player1.projectilesGroup, layers.wallLayer, (projectile, wall) => {
      projectile.setVisible(false);
      projectile.setActive(false);
    });

    // Destructible box logic, may need refactoring
    let boxes = this.physics.add.group();
    boxes.create(600, 400, 'breakable').setScale(0.08);
    boxes.create(800, 400, 'breakable').setScale(0.08);
    boxes.children.each((box) => {
      box.body.immovable = true;
      box.body.moves = false;
    })

    player1.addCollider(boxes);

    this.physics.add.overlap(player1.projectilesGroup, boxes, (projectile, box) => {
      box.destroy();
      projectile.body.reset(0,0);
      // projectile.disableBody(true, true);
      projectile.setActive(false);
      projectile.setVisible(false);
    }, null, this);




    //SOCKETS
    // let self = this;
    // this.socket = io('http://localhost:3000') //this will need to change on prod server
    // this.socket.on('connect', function() {
    //   console.log(`User: ... has connected`);
    // });
    this.socket.on('playerMoved', function (data) {
      console.log("others players movement data:", data);
    })

    

    // this.socket.emit('test', "hello from GameScene");

    // this.socket.on('currentPlayers', (players) => {
    //   Object.keys(players).forEach((id) => {
    //     if (players[id].playerId === self.socket.id) {
    //       addPlayer(self, players[id]);
    //     }
    //   });
    // });
    // this.otherPlayers = this.physics.add.group();
    // this.socket.on('currentPlayers', function (players) {
    //   Object.keys(players).forEach(function (id) {
    //     if (players[id].playerId === self.socket.id) {
    //       addPlayer(self, players[id]);
    //     } else {
    //       addOtherPlayers(self, players[id]);
    //     }
    //   });
    // });

    // this.socket.on('newPlayer', function (playerInfo) {
    //   addOtherPlayers(self, playerInfo);
    // });

    // this.socket.on('remove', function (playerId) {
    //   self.otherPlayers.getChildren().forEach(function (otherPlayer) {
    //     if (playerId === otherPlayer.playerId) {
    //       otherPlayer.destroy();
    //     }
    //   });
    // });

    // // Add players
    // function addPlayer(self, playerInfo) {
    //   self.tankP1 = self.physics.add.image(playerInfo.x, playerInfo.y, 'tankP1').setOrigin(0.5, 0.5).setDisplaySize(64, 64);
    //   // if (playerInfo.team === 'blue') {
    //   //   self.tankP1.setTint(0x0000ff);
    //   // } else {
    //   //   self.tankP1.setTint(0xff0000);
    //   // }
    //   self.tankP1.setDrag(100);
    //   self.tankP1.setAngularDrag(100);
    //   self.tankP1.setMaxVelocity(200);
    // }

    // function addOtherPlayers(self, playerInfo) {
    //   const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'tankP2').setOrigin(0.5, 0.5).setDisplaySize(64, 64);
    //   // if (playerInfo.team === 'blue') {
    //   //   otherPlayer.setTint(0x0000ff);
    //   // } else {
    //   //   otherPlayer.setTint(0xff0000);
    //   // }
    //   otherPlayer.playerId = playerInfo.playerId;
    //   self.otherPlayers.add(otherPlayer);
    // }

  //   // Input
    

  //   this.socket.on('playerMoved', function (playerInfo) {
  //     self.otherPlayers.getChildren().forEach(function (otherPlayer) {
  //       if (playerInfo.playerId === otherPlayer.playerId) {
  //         otherPlayer.setRotation(playerInfo.rotation);
  //         otherPlayer.setPosition(playerInfo.x, playerInfo.y);
  //       }
  //     });
  //   });
   

  //   spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  //   // Collisions
  //   this.physics.add.collider(tankP1, unbreakable);
  //   this.physics.add.overlap(p1Bullets, unbreakable, destroyBullet, null, this);

    // bullets = this.physics.add.group();

  }

  /*
  destroyBox(projectile, box) {
    console.log("Destroying box");
    box.disableBody(true, true);
    projectile.disableBody(true, true);
  }
  */
  
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
    // const boxLayer = map.createLayer('boxlayer', )

    wallLayer.setCollisionByExclusion([-1]);
    groundLayer.setDepth(-1);
    return {groundLayer, wallLayer};

  }

  createPlayer() {
    return new Player(this,100,100, this.socket, this.state);
  }
  
  createOtherPlayer() {
    
  }
}
