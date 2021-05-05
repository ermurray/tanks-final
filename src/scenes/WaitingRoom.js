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


  
  
    thisScene.popUp = thisScene.add.graphics();
    thisScene.boxes = thisScene.add.graphics();

    // for popup window
    thisScene.popUp.lineStyle(1, 0xffffff);
    thisScene.popUp.fillStyle(0xffffff, 0.5);

    // for boxes
    thisScene.boxes.lineStyle(1, 0xffffff);
    thisScene.boxes.fillStyle(0xa9a9a9, 1);

    // popup window
    
    thisScene.popUp.strokeRect(230, 25, 750, 500);
    thisScene.popUp.fillRect(230, 25, 750, 500);

    //title
    thisScene.title = thisScene.add.text(305, 75, "Create or Join a Game", {
      fontFamily: 'Pixelar',
      fill: "#add8e6",
      fontSize: "72px",
      fontStyle: "bold",
    });

    //left popup
    // thisScene.boxes.strokeRect(310, 200, 275, 100);
    // thisScene.boxes.fillRect(310, 200, 275, 200);
    thisScene.requestButton = thisScene.add.sprite(448, 270, "new-game").setScale(0.5);

    
    //right popup
    // thisScene.boxes.strokeRect(625, 200, 275, 100);
    // thisScene.boxes.fillRect(625, 200, 275, 200);

    /*
    thisScene.textInput = this.add.dom(855, 640).createFromCache('chat-form').setOrigin(0);  
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    
    this.enterKey.on('down', e => {
      const chatBox = thisScene.textInput.getChildByName("chat-form");
      if (chatBox.value !== "") {
        
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
    */

//prevent form default action on enter key
    thisScene.inputElement = thisScene.add.dom(675, 250).createFromCache('key-form');
    thisScene.input.keyboard.on('keydown_ENTER', e => {
      e.preventDefault();
    })

// on click of enterRoom button emit isKeyValid to server and initiate validation
    thisScene.inputElement.addListener("click");
    thisScene.inputElement.on("click", function (event) {
      if (event.target.name === "enterRoom") {
// form input in waiting room
        thisScene.sound.play('buttonClick',{loop:false, volume:0.5});
        const input = thisScene.inputElement.getChildByName("code-form");
        const playerName = thisScene.inputElement.getChildByName('pname-form');
        // console.log(thisScene.inputElement.getChildByName("pname-form").value);
        // console.log("this is the player name:", playerName.value);
        // console.log("this is the key code:", input.value);
        thisScene.socket.emit("isKeyValid", input.value, playerName.value);
      }
    });
// if room key validation succeds on server recive keyIsValid message and emit joinRoom with input of form from above stop waiting room scene to make lobby scene active.
    thisScene.socket.on("keyIsValid", function (input, playerName) {
      if (thisScene.inputElement.getChildByName("pname-form").value) {
        thisScene.socket.emit("joinRoom", input, playerName);
      } else {
        thisScene.notValidText.setText("Invalid player name");
      }
      thisScene.socket.on('joining',() => {
        thisScene.scene.stop("scene-waitingRoom");
        thisScene.scene.setActive(true, "scene-lobby");
      });
      thisScene.socket.on('roomFull',() =>{
        thisScene.notValidText.setText('This room is full');
      });
    });


//emit event to server to generate room code and create new room
    thisScene.requestButton.setInteractive();
    thisScene.requestButton.on("pointerdown", () => {
      thisScene.requestButton.setTexture('new-game-p');
      thisScene.sound.play('buttonClick',{loop:false, volume:0.5});
      setTimeout(() => {
        thisScene.requestButton.setTexture('new-game');
      }, 200);
      thisScene.socket.emit("getRoomCode");
    });

    thisScene.notValidText = thisScene.add.text(670, 170, "", {
      fill: "#ff0000",
      fontSize: "28px",
      fontFamily: "Pixelar"
    });

    thisScene.roomKeyText = thisScene.add.text(370, 320, "", {
      fill: "#00ff00",
      fontSize: "28px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    });

    thisScene.socket.on("roomCreated", function (roomKey) {
      thisScene.roomKey = roomKey;
      thisScene.roomKeyText.setText(thisScene.roomKey);
      thisScene.inputElement.getChildByName("code-form").value = thisScene.roomKey;
    });
    thisScene.socket.on("keyNotValid", function () {
      thisScene.notValidText.setText("Invalid Room Key");
    });
    
  }

}