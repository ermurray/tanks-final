import Phaser from 'phaser';
import io from 'socket.io-client';


export default class Lobby extends Phaser.Scene {
  constructor() {
    super('scene-lobby');
    this.state = {};
    this.hasBeenSet = false;
  }
  init(data){
    this.socket = data.socket;
    this.chatMessages = ['CHAT INITIALIZED'];
  }
  
  create() {


    const thisScene = this;
    this.otherPlayers = this.physics.add.group();

    this.socket = io('http://localhost:3000') //this will need to change on prod server
    this.socket.on('connect', function() {
      console.log(`You have connected`);
    });
    
    this.registry.set('socket', this.socket);
    this.registry.set('state', this.state);
    console.log("--->state in lobby",this.state);
    this.scene.launch("scene-waitingRoom", {Socket: this.scene.socket})
    this.add.image(0,0, 'bckgrnd').setOrigin(0).setScale(0.5);
    
    const roomInfoText = this.add.text(500, 20, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold"
    })
    
    
    this.socket.on('setState', function(state) {
      const {roomKey, players, numPlayers } = state
      thisScene.state.roomKey = roomKey;
      thisScene.state.players = players;
      thisScene.state.playerName = players[thisScene.socket.id].pName;
      thisScene.state.numPlayers = numPlayers;
      const roomtext = `GAME KEY: ${roomKey} \n PLAYERS: ${numPlayers}/4`
      roomInfoText.setText(roomtext);
      if(thisScene.chatMessages.length > 20){
        thisScene.chatMessages.shift();
      }
      thisScene.chat.setText(this.chatMessages)
      thisScene.chatMessages.push(`Hi ${thisScene.state.playerName} Welcome to ${roomKey}`)
      // console.log("setstate", thisScene.chatMessages)
      thisScene.chat.setText(thisScene.chatMessages)
      console.log("--->",thisScene.state.playerName)
    });
    
    // PLAYERS
    // this.socket.on("currentPlayers", function (arg) {
    //   const { players, numPlayers } = arg;
    //   thisScene.state.numPlayers = numPlayers;
    //   Object.keys(players).forEach(function (id) {
    //     if (players[id].playerId === thisScene.socket.id) {
    //       thisScene.addPlayer(thisScene, players[id]);
    //     } else {
    //       scene.addOtherPlayers(thisScene, players[id]);
    //     }
    //   });
    // });




    // this.socket.on("newPlayer", function (arg) {
    //   const { playerInfo, numPlayers } = arg;
    //   thisScene.addOtherPlayers(thisScene, playerInfo);
    //   thisScene.state.numPlayers = numPlayers;
    // });
    this.chatheader = this.add.text(850, 10, "TANK CHAT",{
      lineSpacing: 10,
      backroundColor: '0xa9a9a9',
      color: '#26924F',
      padding: 10,
      fontStyle: 'bold',
    }) 
    this.chat = this.add.text(850, 25, "",{
      lineSpacing: 10,
      backroundColor: '0xa9a9a9',
      color: '#26924F',
      padding: 10,
      fontStyle: 'bold',
      wordWrap: {
        width: 325
      }
      
    });
    thisScene.textInput = this.add.dom(875, 540).createFromCache('chat-form');  
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    
    this.enterKey.on('down', e => {
      const chatBox = thisScene.textInput.getChildByName("chat-form");
      if (chatBox.value !== "") {
        console.log(chatBox.value);
        const message = {
          message: chatBox.value,
          pName: thisScene.state.playerName,
          roomKey: thisScene.state.roomKey
        };
        thisScene.socket.emit("chatMessage", message)
        chatBox.value = ""
      }
      // }
    })
    
    this.socket.on("message", (pName,message)=>{

      thisScene.chatMessages.push(`${pName}: ${message}`)
      if(this.chatMessages.length > 20){
        this.chatMessages.shift();
      }
      this.chat.setText(this.chatMessages)
    });

   


    this.strtSmall = this.add.sprite(600, 540, 'start-sm')
    this.strtSmall.setInteractive();
    this.strtSmall.on('pointerdown', this.onDown,this)
  }

  onDown() {
    this.scene.start ('scene-game')
    // let data = "hello there from bootscene"
    // this.socket.emit("test", data)
  }

  update(){
    // console.log("state in lobby update method",this.state);
  }
}