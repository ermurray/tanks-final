export default anims => {
  // anims.create({key: 'idle',  
  //   frames: anims.generateFrameNumbers('player', {start:0, end: 7}),
    // frameRate: 10,
    // repeate: -1,  //makes it infinite 
  // })  
  
  
    // anims.create({key: 'run',  
  //   frames: this.scen.anims.generateFrameNumbers('player', {start:9, end: 16})  
  // })  
  //then import where needed as ??import initAnimations from './relPath'?? 
  // and call with the function initAnimations(this.scene.anims); in the init of the class
  // this.play('key', true) where you want it to play
  //use simple ternary to change from idle to moving anim by using this.body.velocity.equals({x:0, y:0})

  anims.create({
    key:  'boxDestroy',
    frames: anims.generateFrameNumbers('woodBox', {start:0, end:4}),
    frameRate: 11,
    repeat: 0
  })

  anims.create({
    key: 'heartRotate',
    frames: anims.generateFrameNumbers('hearts', {start:0, end:7}),
    frameRate: 7,
    repeat: -1
  })
  

  }