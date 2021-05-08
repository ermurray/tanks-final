
import Phaser from 'phaser';
import io from 'socket.io-client';

const SOCKET = process.env.SOCKET

console.log("env check", process.env.SOCKET);
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

    this.mainTheme = this.sound.add('mainTheme', {loop: true, volume: 0.10})
    

    const thisScene = this;
   
    // 'http://localhost:3000' || SOCKET
    this.socket = io('http://localhost:3000') //this will need to change on prod or dev server
    this.socket.on('connect', function() {
      // console.log('you have connected to the server')
    });
    
    this.registry.set('socket', this.socket);
    this.registry.set('state', this.state);
    this.state.gameOver = false;
    
    this.scene.launch("scene-waitingRoom", {Socket: this.scene.socket});
    this.scene.launch("scene-gameOver", {gameOver: false, Socket: this.scene.socket});
    this.scene.setActive(false, 'scene-gameover');
    this.scene.sendToBack('scene-gameover');
    this.add.image(0,0, 'bckgrnd').setOrigin(0).setScale(0.5);
    
    const roomInfoText = this.add.text(500, 20, "", {
      fill: "#00ff00",
      fontSize: "36px",
      fontStyle: "bold",
      fontFamily: 'Pixelar',
    })
    
    
    this.socket.on('setState', function(state) {
      const {roomKey, players, numPlayers, numReadyPlayers, roomReady} = state
      thisScene.state.roomKey = roomKey;
      thisScene.state.numReadyPlayers = numReadyPlayers;
      console.log(`Roomkey: ${roomKey}`);
      thisScene.state.players = players;
      // console.log(players);
      //-----------------------------------------
      // assignment will need to be fixed here it is adding it to state object instead of inside the players object there are other locations that it is being called in the lobby that will break if not all changed.
      //thisScene.state.playerName = players[thisScene.socket.id].pName; 
      //--------------------------------------
      thisScene.state.numPlayers = numPlayers;
      thisScene.state.roomReady = roomReady;
      thisScene.state.numReadyPlayers = numReadyPlayers;
      thisScene.state.players[thisScene.socket.id].pNumber = players[thisScene.socket.id].pNumber;
      const roomtext = `GAME KEY: ${roomKey} \n PLAYERS: ${numPlayers}/4`
      roomInfoText.setText(roomtext);
      //---------------------------------------
      // for(const player in thisScene.state.players){
      //   thisScene.setTankSelection(player.id, player, player.pName)
      // }
      //---------------------- refactor below with above but currently seTankSelection is broken
      for(const player in thisScene.state.players) {
          const tankSelected = thisScene.state.players[player].pNumber;
         
          const playerName = thisScene.state.players[player].pName;
        switch(tankSelected){
          case 'p1':
            thisScene.setPlayerText(thisScene.p1Text, playerName)
            break;
          case 'p2':
            thisScene.setPlayerText(thisScene.p2Text, playerName)
            break;
          case 'p3':
            thisScene.setPlayerText(thisScene.p3Text, playerName)
            break;
          case 'p4':
            thisScene.setPlayerText(thisScene.p4Text, playerName)    
            break;
  
        };
      }
      if(thisScene.chatMessages.length > 20){
        thisScene.chatMessages.shift();
      }
      thisScene.chatMessages.push(`Hi ${thisScene.state.playerName} Welcome to ${roomKey}, please select a tank`)
      thisScene.chat.setText(thisScene.chatMessages)
    });
    
    this.socket.on("newPlayer", function(data){
      const newPlayerId = data.playerInfo.playerId;
      const newPName = data.playerInfo.pName;
      thisScene.chatMessages.push(`---------------`,`A Rogue Operator: ${newPName}, has `,`joined the battle`, `---------------`,`Fire Away`);
      if(thisScene.chatMessages.length >= 20){
        thisScene.chatMessages.shift();
      }
      thisScene.chat.setText(thisScene.chatMessages)

      
      thisScene.state.players[newPlayerId] = data.playerInfo;
      thisScene.state.numPlayers = data.numPlayers;
      const roomtext = `GAME KEY: ${thisScene.state.roomKey} \n PLAYERS: ${thisScene.state.numPlayers}/4`;
      roomInfoText.setText(roomtext);
     
    });
   
    
    this.chatheader = this.add.text(850, -100, "TANK CHAT",{
      lineSpacing: 10,
      fontFamily: 'Pixelar',
      backroundColor: '0xa9a9a9',
      color: '#26924F',
      padding: 10,
      fontStyle: 'bold',
      fontSize: '28px'
    }) 

    
   


    this.chat = this.add.text(850, -80, "",{
      lineSpacing: 5,
      backroundColor: '0xa9a9a9',
      color: '#26924F',
      padding: 10,
      fontStyle: 'bold',
      fontFamily: 'Pixelar',
      fontSize: '28px',
      wordWrap: {
        width: 325
      }
      
    });

    this.tweens.add({
      targets: this.chatheader,
      y: 10,
      duration:3000,
      ease: 'Power3'
    })
    this.tweens.add({
      targets: this.chat,
      y: 30,
      duration:3000,
      ease: 'Power3'
    })

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
    this.tweens.add({
      targets: thisScene.textInput,
      y:540,
      duration:3000,
      ease: 'Power3'
    })
    this.socket.on("message", (pName,message)=>{

      thisScene.chatMessages.push(`${pName}: ${message}`)
      if(this.chatMessages.length > 20){
        this.chatMessages.shift();
      }
      this.chat.setText(this.chatMessages)
    });

   
    this.timerText = this.add.text(400,800,"waiting for other players",{
      fill: "#00ff00",
      fontSize: "40px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    });
    
    this.readyBtn = this.add.sprite(600, 540, 'readyBtn').setScale(0.5).setAlpha(0);
    
    this.readyBtn.setInteractive();
    this.readyBtn.on('pointerdown', this.onDown, this);
    this.tweens.add({
      targets: thisScene.readyBtn,
      alpha: 1,
      duration:3000,
      ease: 'Power3'
    })
    
    // player Number Selection
  //----------------------------------------------------------------
  
    this.p1Text = this.add.text(400, 150, "", {
      fill: "#00ff00",
      fontSize: "28px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    });

    this.p1ReadyText = this.add.text(400, 175, "", {
      fill: "#00ff00",
      fontSize: "28px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    })

  
    this.p1Select = this.add.sprite(-100,150,'tankBlue').setInteractive();
    this.p1Select.on('pointerdown', (e) => {
      thisScene.setPlayerText(thisScene.p1Text, thisScene.state.playerName, thisScene.state.players[thisScene.socket.id].pNumber);
      
      thisScene.state.players[thisScene.socket.id].pNumber = "p1";
      
      thisScene.socket.emit("set-pNumber", this.socket.id, thisScene.state);
      
    
    });

    

    this.p2Select = this.add.sprite(-100,250,'tankRed').setInteractive();
    this.p2Select.on('pointerdown', (e) => {
      thisScene.setPlayerText(thisScene.p2Text, thisScene.state.playerName, thisScene.state.players[thisScene.socket.id].pNumber);
     
      thisScene.state.players[thisScene.socket.id].pNumber = "p2";
      thisScene.socket.emit("set-pNumber", this.socket.id, thisScene.state)
      
    });


    this.p2Text = this.add.text(400, 250, "", {
      fill: "#00ff00",
      fontSize: "28px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    });

    this.p2ReadyText = this.add.text(400, 275, "", {
      fill: "#00ff00",
      fontSize: "28px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    })

    this.p3Select = this.add.sprite(-100, 350,'tankGreen').setInteractive();
    this.p3Select.on('pointerdown', (e) => {
      
     
      thisScene.setPlayerText(thisScene.p3Text, thisScene.state.playerName, thisScene.state.players[thisScene.socket.id].pNumber);
      thisScene.state.players[thisScene.socket.id].pNumber = "p3";
      thisScene.socket.emit("set-pNumber", this.socket.id, thisScene.state)
     
    });

    this.p3Text = this.add.text(400, 350, "", {
      fill: "#00ff00",
      fontSize: "28px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    })
    this.p3ReadyText = this.add.text(400, 375, "", {
      fill: "#00ff00",
      fontSize: "28px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    })

    this.p4Select = this.add.sprite(-100,450,'tankYellow').setInteractive();
    this.p4Select.on('pointerdown', (e) => {
      thisScene.setPlayerText(thisScene.p4Text, thisScene.state.playerName, thisScene.state.players[thisScene.socket.id].pNumber);
      thisScene.state.players[thisScene.socket.id].pNumber = "p4";
      
      thisScene.socket.emit("set-pNumber", this.socket.id, thisScene.state);
     
    });

    this.p4Text = this.add.text(400, 450, "", {
      fill: "#00ff00",
      fontSize: "28px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    });
    
    this.p4ReadyText = this.add.text(400, 475, "", {
      fill: "#00ff00",
      fontSize: "28px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    })

    this.socket.on('player-selectedTank', (playerID, playerObj, playerName) => {
      const oldTankSelected = thisScene.state.players[playerID].pNumber
      thisScene.state.players[playerID] = playerObj
      const tankSelected = playerObj.pNumber
   
      switch(tankSelected){
        case 'p1':
          thisScene.setPlayerText(thisScene.p1Text, playerName, oldTankSelected);
  
          break;
        case 'p2':
          thisScene.setPlayerText(thisScene.p2Text, playerName, oldTankSelected);
         
          break;
        case 'p3':
          thisScene.setPlayerText(thisScene.p3Text, playerName, oldTankSelected );
        
          break;
        case 'p4':
          thisScene.setPlayerText(thisScene.p4Text, playerName, oldTankSelected );
        
          break;

      };
     
    });
//-----------------------------------------------------------------
//endof player number selection
    
      
    this.tweens.add({
      targets: [this.p1Select, this.p2Select, this.p3Select, this.p4Select],
      x:300,
      duration:3000,
      ease: 'Power3'
    })
    

    this.socket.on('transToGame', (data)=>{
      this.state.currentRoom = data
      this.countDown(this.timerText)
    this.tweens.add({
      targets: this.timerText,
      alpha: 1,
      duration:1000,
      ease: 'Power3'
     })
    this.tweens.add({
      targets: this.timerText,
      y:300,
      duration:3000,
      ease: 'Power3'
      })
    })

    //listen for playerIsReady set state and text for which player is ready
    this.socket.on('playerIsReady',(readyPlayer) =>{
      switch (readyPlayer) {
        case 'p1':
         this.p1ReadyText.setText('READY');
         this.p1Select.disableInteractive();
          break;
        case 'p2':
          this.p2ReadyText.setText('READY');
          this.p2Select.disableInteractive();
          break;
        case 'p3':
          this.p3ReadyText.setText('READY');
          this.p3Select.disableInteractive();
          break;
        case 'p4':
          this.p4ReadyText.setText('READY');
          this.p4Select.disableInteractive();
          break;
       }

    });



    
    if(this.mainTheme){
      this.mainTheme.play();
    }
  }
//-----------------------------------------------------------------
//endof scene create method
  disableSelectors(){
    this.p1Select.disableInteractive();
    this.p2Select.disableInteractive();
    this.p3Select.disableInteractive();
    this.p4Select.disableInteractive();
    this.readyBtn.disableInteractive();
  }

  onDown() {
    this.readyBtn.setTexture('readyBtn-p')
    setTimeout(() => {
      this.readyBtn.setTexture('readyBtn');
    }, 200)
    this.disableSelectors();
    let readyPlayer = this.state.players[this.socket.id].pNumber;
   
    this.state.players[this.socket.id].isReady = true;
  
    
   
    this.socket.emit('playerReady', this.state, readyPlayer)
    
  }

  update(){
  }


  
  setPlayerText(textarea, playerName, oldPNumber = ''){
    if (oldPNumber !== ''){
     switch (oldPNumber) {
      case 'p1':
       this.p1Text.setText('');
       this.p1ReadyText.setText('');
        break;
      case 'p2':
       this.p2Text.setText('');
       this.p2ReadyText.setText('');
        break;
      case 'p3':
        this.p3Text.setText('');
        this.p3ReadyText.setText('');
        break;
      case 'p4':
       this.p4Text.setText('');
       this.p4ReadyText.setText('');
        break;
     }
    

    }
   textarea.setText(`Operator: ${playerName} will be this tank`)
  }

  countDown(text){
    this.mainTheme.pause();
    this.tweens.add({
      targets: this.textInput,
      y:855,
      duration:3000,
      ease: 'Power3'
    })
    let count = 4;
    let counter = setInterval(()=>{

      count -= 1;
      
      text.setText(`${count}...`)
      if(count < 1){
        
        this.scene.pause('scene-lobby');
        this.scene.launch('scene-game'); // Change to scene-gameover for testing
        this.scene.pause('scene-game');
        clearInterval(counter);
        text.destroy();
       
      } 

    },1000)
  }
}
