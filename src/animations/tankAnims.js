export default anims => {
// anims.create({key: 'idle',  
//   frames: this.scen.anims.generateFrameNumbers('player', {start:0, end: 7}),
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
    key:  'move_blue',
    frames: anims.generateFrameNumbers('blue_tank_spritesheet', {start:0, end:1}),
    frameRate: 10,
    repeat: -1 
  })
  anims.create({
    key:  'move_red',
    frames: anims.generateFrameNumbers('red_tank_spritesheet', {start:0, end:1}),
    frameRate: 10,
    repeat: -1 
  })
  anims.create({
    key:  'move_green',
    frames: anims.generateFrameNumbers('green_tank_spritesheet', {start:0, end:1}),
    frameRate: 10,
    repeat: -1 
  })
  anims.create({
    key:  'move_yellow',
    frames: anims.generateFrameNumbers('yellow_tank_spritesheet', {start:0, end:1}),
    frameRate: 10,
    repeat: -1 
  })
}