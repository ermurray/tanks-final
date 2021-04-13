import Phaser from 'phaser';
import io from 'socket.io-client';


export default class Lobby extends Phaser.Scene {
  constructor() {
    super('scene-lobby');
    // this.state = {};
    // this.hasBeenSet = false;
  }
  // init(){
  //   this.socket = io("http://localhost:3000", {autoConnect: false});
  //   this.chatMessages = [];
  // }
 
  create() {
    this.add.image(0,0, 'bckgrnd').setOrigin(0).setScale(0.5);
    this.textInput = this.add.dom(1100, 540).createFromCache('chat-form').setOrigin(0.5);   
    this.chat = this.add.text(900, 10, "Chat text will go here",{
      lineSpacing: 15,
      backroundColor: '#21313CDD',
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
}