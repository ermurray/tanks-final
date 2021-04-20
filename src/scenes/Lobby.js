
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


    const thisScene = this;
   
    // 'http://localhost:3000'
    this.socket = io('http://localhost:3000') //this will need to change on prod or dev server
    this.socket.on('connect', function() {
      // console.log('you have connected to the server')
    });
    
    this.registry.set('socket', this.socket);
    this.registry.set('state', this.state);
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
      // console.log(players);
      //-----------------------------------------
      // assignment will need to be fixed here it is adding it to state object instead of inside the players object there are other locations that it is being called in the lobby that will break if not all changed.
      thisScene.state.playerName = players[thisScene.socket.id].pName; 
      //--------------------------------------
      thisScene.state.numPlayers = numPlayers;
  
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
      backroundColor: '0xa9a9a9',
      color: '#26924F',
      padding: 10,
      fontStyle: 'bold',
    }) 

    
   


    this.chat = this.add.text(850, -80, "",{
      lineSpacing: 5,
      backroundColor: '0xa9a9a9',
      color: '#26924F',
      padding: 10,
      fontStyle: 'bold',
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
      fontStyle: "bold"
    });
    
    this.strtSmall = this.add.sprite(600, 540, 'start-sm');
    // this.strtSmall.setInteractive();
    

  
    this.strtSmall.setInteractive();
    this.strtSmall.on('pointerdown', this.onDown,this);
    
    // player Number Selection
  //----------------------------------------------------------------
  
    this.p1Text = this.add.text(400, 150, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold"
    });

    let readyPlayers = [0, 0, 0, 0]
    this.p1Select = this.add.sprite(-100,150,'tankBlue').setInteractive();
    this.p1Select.on('pointerdown', (e) => {
      thisScene.setPlayerText(thisScene.p1Text, thisScene.state.playerName, thisScene.state.players[thisScene.socket.id].pNumber);
      
      thisScene.state.players[thisScene.socket.id].pNumber = "p1";
      thisScene.socket.emit("set-pNumber", this.socket.id, thisScene.state);
      readyPlayers[0] = true;
    
    });

    

    this.p2Select = this.add.sprite(-100,250,'tankRed').setInteractive();
    this.p2Select.on('pointerdown', (e) => {
      thisScene.setPlayerText(thisScene.p2Text, thisScene.state.playerName, thisScene.state.players[thisScene.socket.id].pNumber);
     
      thisScene.state.players[thisScene.socket.id].pNumber = "p2";
      thisScene.socket.emit("set-pNumber", this.socket.id, thisScene.state)
      readyPlayers[1] = true;
    });


    this.p2Text = this.add.text(400, 250, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold"
    });

    this.p3Select = this.add.sprite(-100,350,'tankGreen').setInteractive();
    this.p3Select.on('pointerdown', (e) => {
      
     
      thisScene.setPlayerText(thisScene.p3Text, thisScene.state.playerName, thisScene.state.players[thisScene.socket.id].pNumber);
      thisScene.state.players[thisScene.socket.id].pNumber = "p3";
      thisScene.socket.emit("set-pNumber", this.socket.id, thisScene.state)
      readyPlayers[2] = true;
    });

    this.p3Text = this.add.text(400, 350, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold"
    })


    this.p4Select = this.add.sprite(-100,450,'tankYellow').setInteractive();
    this.p4Select.on('pointerdown', (e) => {
      thisScene.setPlayerText(thisScene.p4Text, thisScene.state.playerName, thisScene.state.players[thisScene.socket.id].pNumber);
      thisScene.state.players[thisScene.socket.id].pNumber = "p4";
      
      thisScene.socket.emit("set-pNumber", this.socket.id, thisScene.state);
      readyPlayers[3] = true;
    });

    this.p4Text = this.add.text(400, 450, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold"
    });
    
    this.socket.on('player-selectedTank', (playerID, playerObj, playerName) => {
      const oldTankSelected = thisScene.state.players[playerID].pNumber
      thisScene.state.players[playerID] = playerObj
      const tankSelected = playerObj.pNumber
      // let blankCount = 1;
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

    
    

  }
//-----------------------------------------------------------------
//endof scene create method
  
  onDown() {
    // If there are enough players
    let ready = true;
    for (const player in this.state.players) {
      if (!this.state.players[player].pNumber) {
        ready = false;
        this.tweens.add({
          targets: this.timerText,
          y:280,
          duration:3000,
          ease: 'Power3'
        })
        this.tweens.add({
          targets: this.timerText,
          alpha: 0,
          duration:6000,
          ease: 'Power3'
        })

      }
    }
    if (ready === true) {
      // let data = this.state.
      console.log(this.state);
      this.socket.emit('players-lobbyready', this.state)
      this.socket.on('transToGame', (data)=>{
        this.state.currentRoom = data
        this.countDown(this.timerText)
      this.tweens.add({
        targets: this.timerText,
        alpha: 1,
        duration:6000,
        ease: 'Power3'
      })
      this.tweens.add({
        targets: this.timerText,
        y:280,
        duration:3000,
        ease: 'Power3'
      })
      })
      
    } else {
      return;
    }
  }

  update(){
  }


  
  setPlayerText(textarea, playerName, oldPNumber = ''){
    if (oldPNumber !== ''){
     switch (oldPNumber) {
      case 'p1':
       this.p1Text.setText('');
        break;
      case 'p2':
       this.p2Text.setText('');
        break;
      case 'p3':
        this.p3Text.setText('');    
        break;
      case 'p4':
       this.p4Text.setText('');
        break;
     }
    

    }
   textarea.setText(`Operator:${playerName} will be this tank`)
  }
  countDown(text){
    let count = 4;
    let counter = setInterval(()=>{

      count -= 1;
      
      text.setText(`${count}...`)
      if(count < 1){
        this.scene.start('scene-game');
        this.scene.pause('scene-game');
        clearInterval(counter);
        text.destroy();
       
      } 

    },1000)
  }
}
