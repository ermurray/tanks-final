import Phaser from "phaser";
import io from 'socket.io-client';

export default class WaitingRoom extends Phaser.Scene {
  constructor() {
    super("scene-waitingRoom");
    this.state = {};
    this.hasBeenSet = false;
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    
  }

  create() {

    
    
    const scene = this;


    //SOCKETS
    scene.socket = io('http://localhost:3000') //this will need to change on prod server
    scene.socket.on('connect', function() {
      console.log(`You have connected`);
    });
    let payload = {message: "hello from waiting room scene"}
    scene.socket.emit('payloadDataTest', payload);
    

    
    
    scene.popUp = scene.add.graphics();
    scene.boxes = scene.add.graphics();

    // for popup window
    scene.popUp.lineStyle(1, 0xffffff);
    scene.popUp.fillStyle(0xffffff, 0.5);

    // for boxes
    scene.boxes.lineStyle(1, 0xffffff);
    scene.boxes.fillStyle(0xa9a9a9, 1);

    // popup window
    scene.popUp.strokeRect(25, 25, 750, 500);
    scene.popUp.fillRect(25, 25, 750, 500);

    //title
    scene.title = scene.add.text(100, 75, "Tank Multiplayer", {
      fill: "#add8e6",
      fontSize: "66px",
      fontStyle: "bold",
    });

    //left popup
    scene.boxes.strokeRect(100, 200, 275, 100);
    scene.boxes.fillRect(100, 200, 275, 100);
    scene.requestButton = scene.add.text(140, 215, "Request Room Key", {
      fill: "#000000",
      fontSize: "20px",
      fontStyle: "bold",
    });

    
    //right popup
    scene.boxes.strokeRect(425, 200, 275, 100);
    scene.boxes.fillRect(425, 200, 275, 100);

    

    scene.inputElement = scene.add.dom(562.5, 250).createFromCache('key-form');
    scene.input.keyboard.on('keydown_ENTER', e => {
      e.preventDefault();
    })
    scene.inputElement.addListener("click");
    scene.inputElement.on("click", function (event) {
      if (event.target.name === "enterRoom") {
        const input = scene.inputElement.getChildByName("code-form");
        const playerName = scene.inputElement.getChildByName('pname-form')
        console.log("this is the key code:", input.value);
        console.log("this is the player name:", playerName.value);
        scene.socket.emit("isKeyValid", input.value);
      }
    });

    scene.requestButton.setInteractive();
    scene.requestButton.on("pointerdown", () => {
      scene.socket.emit("getRoomCode");
    });

    scene.notValidText = scene.add.text(670, 295, "", {
      fill: "#ff0000",
      fontSize: "15px",
    });

    scene.roomKeyText = scene.add.text(210, 250, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold",
    });

    scene.socket.on("roomCreated", function (roomKey) {
      scene.roomKey = roomKey;
      scene.roomKeyText.setText(scene.roomKey);
    });

    scene.socket.on("keyNotValid", function () {
      scene.notValidText.setText("Invalid Room Key");
    });

    scene.socket.on("keyIsValid", function (input) {
      scene.socket.emit("joinRoom", input);
      scene.scene.stop("WaitingRoom");
      scene.scene.start('scene-lobby', input)
    });
  }


  update() {}
}