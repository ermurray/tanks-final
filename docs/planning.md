# Tanks



- What problem does our app solve
  - brings ppl together to a retro multiplayer 


### Group members
  - Luke Yin  
  - Matt  Cook     https://github.com/cookie-cpu
  - Eric Murray


# Tech stack

  - Express and express router
    - possible EJS for initial template to be served
  
  - React front end
  - phaser.js for game engine
  - Websocket for multiplayer experience
  - Mongodb  or aws Dynamodb  do we need one ????
  - hosting heroko or s3 buckets aws

# Concept
  - X number of rounds to select with timer ( 30 second min , 90 second max)
  - 2 - 4 player games
  - Round ends with One player left or if timer runs out and more than one player natural disaster happend to eliminate to one. 
  - one shot kill
  - default shot is weak infinite
  - power ups increase attack  | tank speed | fire rate increase | shield adds a hit defense ( power ups are limited time / quantity buff)
  - Hard obstacle constraint borders
  - Hard obstacle to stop spawn kills 
  - Players start in 4 coners of map
  - Map has random tile set of destructable walls in a maze generated (random gen or procedural???)
  - tank is polar movement only allways fires forward
  - Retro Pixel style
  - Different map themes (post apoc. steam punk | Cartoon Warner bros ish |  Modern scifi | fantasy ) one theme to start with raido buttons extra themes are stretch
  - terain tiles (stetch)
  - map size is (to be determined)
  - fire range (to be determined)
  
  - round score (number of wins)
  - leader boards (stretch)
  - Game end scenario after rounds list winner
    - play again button (for all players) goes to game lobby
    - leave lobby ( reduces player count)

  - Main menu/homepage will have:
    - Create lobby
      -  Game  settings menu
      - player name
      - player color
      - lobby name
    - Join lobby
      - enter code
      - choose color
      - player name
    - Control scheme description only
      - WASD 
      - space to fire
      - alternate control options (stretch)

  - Lobby menu
    - Game code visible
    - Ready button for all players ( count 5 second on everyone ready)
    - control scheme description only
    - list of players with indicator on ready button change color

extreme strech goals in game chat

## user stories

- As a Game Master I can create a lobby and recieve a lobby code to share with up to 4 freinds to join 
- As a player I can use a code to connect to a lobby and play with my friends
- I can set my player name and be assigned a color
- I can ready up by click ready button
- I can control my character using WASD and fire with space
- As tank I can move  n-s-e-w and fire
- As a player I can see the score/Round winner count and remaining rounds 
- As a player I can see the time remaining
- As a player once game has ended via round count exceeded I can select play again and remain in the same lobby
- As a player I can leave the game lobby
- I play the game and its fun ( important!)




# Git Workflow / project communicaiton

- trunk based  development
  - no code on master!
  - git rebase vrs merge
  - don't push to master 
  - allways  pr and be descriptive.
  - allways discuss as a team before accepting merge to master.... even if auto merge available .
  - Use our discord channel LHL Tanks final Project!
  - prune old branches 
  - client and server in same repo
  - planning docs here https://drive.google.com/drive/folders/1QQlkETo5o7lPaZntoYEggsJL9lEAuBzb?usp=sharing




# Concerns / clarification 
- instances of games (multiple of them)
- network code for performance minimize latency
- responsiveness
- project scaffold
- websocket
- 