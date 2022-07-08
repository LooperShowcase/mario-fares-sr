kaboom({
  global: true,
  fullscreen: true,
  clearColor: [0, 0.5, 0.9, 1],
  debug: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("block_blue", "block_blue.png");
loadSprite("cloud", "cloud.png");
loadSprite("pipe_up", "pipe_up.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("coin", "coin.png");
loadSprite("mario", "mario.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("tree1", "tree1.png");
loadSprite("castle", "castle.png");
loadSprite("pipe_cut", "pipe_cut.png");


loadSound("sound", "gameSound.mp3");
loadSound("jsound", "jumpSound.mp3");

scene("begin", () => {
  add([text("Super Mario Bros\n By Fares\n\nPress Enter To Start", 30),origin("center"),pos(width()/2,height()/2-120)]);
  keyPress("enter", () => {
    go("game")
      
    }); 
  const btn = add([rect(80,60), origin("center"),pos(width()/2,height()/2), color(1,1,1,0)])
  add([text("Start",24),origin("center"), pos(width()/2,height()/2), color(0,0,0)])



  btn.action(() => {
    if (btn.isHovered()){

      if (mouseIsClicked()){
        go("game")
      }
    }
    else{
      btn.color = rgba(1,1,1,0)
    }
  })
})
scene("win", (score) => {
  add([text ("YOU WIN\n\nScore: "+score, 30),origin("center"),pos(width()/2,height()/2)]);

 })
 


scene("over", (score) => {
 add([text (":C\n Press r to restart\n\nScore: "+score, 30),origin("center"),pos(width()/2,height()/2)]);
 keyDown("r", () =>{
  location.reload()
  
 })
})


scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("sound");

  const key = {
    width: 20,
    height: 20,
    $: [sprite("coin"), "coin"],
    "=": [sprite("block"), solid()],
    x: [sprite("unboxed"), solid()],
    z: [sprite("mushroom"), solid(), "mushroom", body()],
    e: [sprite("goomba"), solid(), "goomba", body()],
    s: [sprite("surprise"), solid(), "surprise-coin"],
    r: [sprite("surprise"), solid(), "surprise-mushroom"],
    j: [sprite("pipe"), solid()],
    c: [sprite("cloud"), scale(2)],
    t: [sprite("tree1"), scale(3)],
    C: [sprite("castle") , "castle"],
    i: [sprite("pipe_cut"), solid()]
  };

  const map = [
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                                                                                                                                      ",
    "                                             c                                                                                                        ",
    "                                                                                                                                                      ",
    "      c                       c                                    c                                                                                  ",
    "                                                     c                                 c                                                              ",
    "                     c                  c                   c                                               c                                         ",
    "                                                                             c                                                                        ",
    "           c                                                                                      c                                                   ",
    "                    c                                                                                                                                 ",
    "                                                       =========              r                         c                                             ",
    "                                                                                                                                                      ",
    "                                       s    ========                                                                    C                             ",
    "                 t                         =            t           j    =====                t                                                       ",
    "                                          =                                                                                                           ",
    "                                         =                         ei                  e                                                              ",
    "========================================================================================================    ==========================================",
    "========================================================================================================    ==========================================",
    "========================================================================================================    ==========================================",
  ];

  const gameLevel = addLevel(map, key);
  const speed = 120;
  const jumpForce = 400;
  let goombaSpeed= 40;
  let isJumping = false;
  let underground = false;
  let score=0;

  const player = add([
    sprite("mario"),
    solid(),
    pos(500, 0),
    body(),
    origin("bot"),
    big(jumpForce)
    
  ]);
  const scoreLabel = add([
    text("SCORE\n" + score, 20),
    origin("center"),
    pos(30, 360),
    layer("ui"),
    {
      value:score
    }
  ])
  



  keyDown("right", () => {
    player.move(speed, 0);
  });

  keyDown("left", () => {
    if (player.pos.x > 500) {
      player.move(-speed, 0);
    }
  });

  keyDown("a", () => {
    if (player.pos.x > 500) {
      player.move(-speed, 0);
    }
  });

  keyDown("d", () => {
    player.move(speed, 0);
  });

  keyDown("s", () => {
    player.move(0, 200);
  });

  keyPress("space", () => {
    if (player.grounded()) {
      isJumping=true;
      player.jump(jumpForce);
      play("jsound");
    }
  });

  keyPress("w", () => {
    if (player.grounded()) {
      isJumping=true;
      player.jump(jumpForce);
      play("jsound");
    }
  });

  keyPress("up", () => {
    if (player.grounded()) {
      isJumping=true;
      player.jump(jumpForce);
      play("jsound");
    }
  });

  keyDown("down", () => {
    player.move(0, 200);
  });

  player.on("headbump", (obj) => 
  {

    if (obj.is("surprise-coin")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }

    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("z", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
  });

    player.collides('coin', ($) => {   
        destroy($)
        scoreLabel.value+=100
        scoreLabel.text="Score: "+ scoreLabel.value
    });

     player.collides('mushroom', (z) => {   
        destroy(z)
        player.biggify(10);
        scoreLabel.value+=50
        scoreLabel.text="Score: "+ scoreLabel.value
        
     });


     action("mushroom" , (z) =>{
        z.move(20 , 0)
     })

     console.log(player.area);
     
     action("goomba", (e) => {
        e.move(-goombaSpeed , 0)
        
     })
     player.collides("goomba", (e) =>{
      if (isJumping==true){
        destroy(e)
        scoreLabel.value+=100
        scoreLabel.text=" Score: "+ scoreLabel.value
      }
      else if (player.isBig()){
        
          player.smallify()
          destroy(e)
          // e.pos.x +=10
          // player.area.p1.x = 0
          // player.area.p1.y = 0
          // player.area.p2.x = 0
          // player.area.p2.y = 0


          // wait(5, ()=>{
          //   player.area.p1.x = -10
          //   player.area.p1.y = -20
          //   player.area.p2.x = 10
          //   player.area.p2.y = 0
          // })
      }
      else{
        destroy(player)
        go("over",scoreLabel.value)
        }
   })

   keyDown("r", () =>{
    location.reload()
   })




  player.action(() => {
    console.log(player.pos.x)
    if(player.pos.x>=2435.688){
      go("win", + scoreLabel.value)
    }
  camPos(player.pos.x, player.pos.y-160);
  scoreLabel.pos.x=player.pos.x -360
  scoreLabel.pos.y=player.pos.y -360 /////////////////////
  if (player.grounded()){
    isJumping=false;
  }
  else {
    isJumping=true;
  }
  if (player.pos.y>= height() + 450){
     go ("over",scoreLabel.value)
  }
  });
  setInterval( () => {
    goombaSpeed =  goombaSpeed * -1
  
  }, 5000);

});


start("begin");
