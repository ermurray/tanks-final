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
    this.chatMessages = ['testing chat functionality local', 'who sent this', 'how to get server message'];
  }
  
  create() {
    const thisScene = this;
    this.socket = io('http://localhost:3000') //this will need to change on prod server
    this.socket.on('connect', function() {
      console.log(`You have connected`);
    });
    
    this.registry.set('socket', this.socket);
    this.registry.set('state', this.state);
    console.log("--->state in lobby",this.state);
    this.scene.launch("scene-waitingRoom", {Socket: this.scene.socket})
    this.add.image(0,0, 'bckgrnd').setOrigin(0).setScale(0.5);
    this.textInput = this.add.dom(1100, 540).createFromCache('chat-form').setOrigin(0.5);   
 
    const roomInfoText = this.add.text(500, 20, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold"
    })


    this.socket.on('setState', function(state) {
      const {roomKey, players, numPlayers } = state
        thisScene.state.roomKey = roomKey;
        thisScene.state.players = players;
        thisScene.state.playerName = players.pName;
        thisScene.state.numPlayers = numPlayers;
      const roomtext = `GAME KEY: ${roomKey} \n PLAYERS: ${numPlayers}/4`
      roomInfoText.setText(roomtext);
      console.log("--->",players)
    });


    this.chat = this.add.text(900, 10, `${this.chatMessages}`,{
      lineSpacing: 15,
      backroundColor: '0xa9a9a9',
      color: '#26924F',
      padding: 10,
      fontStyle: 'bold'
    });

    // this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    // this.enterKey.on('down', e => {

    // })

    // this.socket.connect();

    // this.socket.on("connect", async () => {
    //   this.socket.emit("join", "room")
    // })


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