import Phaser from "phaser";
import io from 'socket.io-client';

export default class WaitingRoom extends Phaser.Scene {
  constructor() {
    super("scene-waitingRoom");
    
  }

  init(data) {
  
  }

  preload() {
    
  }

  create() {
    
    this.socket = this.registry.get('socket');
    
    
    this.scene.moveAbove('scene-lobby','scene-waitingRoom');
    this.scene.setActive(false,'scene-lobby');
    const thisScene = this;


    //SOCKETS
    
    

    
    
    thisScene.popUp = thisScene.add.graphics();
    thisScene.boxes = thisScene.add.graphics();

    // for popup window
    thisScene.popUp.lineStyle(1, 0xffffff);
    thisScene.popUp.fillStyle(0xffffff, 0.5);

    // for boxes
    thisScene.boxes.lineStyle(1, 0xffffff);
    thisScene.boxes.fillStyle(0xa9a9a9, 1);

    // popup window
    
    thisScene.popUp.strokeRect(100, 25, 750, 500);
    thisScene.popUp.fillRect(100, 25, 750, 500);

    //title
    thisScene.title = thisScene.add.text(100, 75, "Tank Multiplayer", {
      fill: "#add8e6",
      fontSize: "66px",
      fontStyle: "bold",
    });

    //left popup
    thisScene.boxes.strokeRect(125, 200, 275, 100);
    thisScene.boxes.fillRect(125, 200, 275, 100);
    thisScene.requestButton = thisScene.add.text(140, 215, "CREATE NEW GAME", {
      fill: "#000000",
      fontSize: "20px",
      fontStyle: "bold",
    });

    
    //right popup
    thisScene.boxes.strokeRect(450, 200, 275, 100);
    thisScene.boxes.fillRect(450, 200, 275, 100);

    
//prevent form default action on enter key
    thisScene.inputElement = thisScene.add.dom(562.5, 250).createFromCache('key-form');
    thisScene.input.keyboard.on('keydown_ENTER', e => {
      e.preventDefault();
    })

// on click of enterRoom button emit isKeyValid to server and initiate validation
    thisScene.inputElement.addListener("click");
    thisScene.inputElement.on("click", function (event) {
      if (event.target.name === "enterRoom") {
// form input in waiting room
        const input = thisScene.inputElement.getChildByName("code-form");
        const playerName = thisScene.inputElement.getChildByName('pname-form');
        console.log(thisScene.inputElement.getChildByName("pname-form").value);
        console.log("this is the player name:", playerName.value);
        console.log("this is the key code:", input.value);
        thisScene.socket.emit("isKeyValid", input.value, playerName.value);
      }
    });
// if room key validation succeds on server recive keyIsValid message and emit joinRoom with input of form from above stop waiting room scene to make lobby scene active.
    thisScene.socket.on("keyIsValid", function (input, playerName) {
      if (thisScene.inputElement.getChildByName("pname-form").value) {
        thisScene.socket.emit("joinRoom", input, playerName);
        thisScene.scene.stop("scene-waitingRoom");
        thisScene.scene.setActive(true, "scene-lobby");
        // scene.scene.start('scene-lobby', input) 
      } else {
        thisScene.notValidText.setText("Invalid player name");
      }
    });


//emit event to server to generate room code and create new room
    thisScene.requestButton.setInteractive();
    thisScene.requestButton.on("pointerdown", () => {
      thisScene.socket.emit("getRoomCode");
    });

    thisScene.notValidText = thisScene.add.text(670, 295, "", {
      fill: "#ff0000",
      fontSize: "15px",
    });

    thisScene.roomKeyText = thisScene.add.text(210, 250, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold",
    });

    thisScene.socket.on("roomCreated", function (roomKey) {
      thisScene.roomKey = roomKey;
      thisScene.roomKeyText.setText(thisScene.roomKey);
      thisScene.inputElement.getChildByName("code-form").value = thisScene.roomKey;
    });

    thisScene.socket.on("keyNotValid", function () {
      thisScene.notValidText.setText("Invalid Room Key");
    });
    thisScene.socket.on("gameIsFull", () =>{
      thisScene.notValidText.setText("This game is full");
    })
  }

}