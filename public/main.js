//var socket = io();

window.addEventListener("load", ()=> {
  //load Function
  const LOADING = {
    TEXT: document.getElementById("ltxt"),
    PROGRESS: document.getElementById('prog'),
    BODY: document.getElementById('loadbody')
  }
  LOADING.PROGRESS.style.width = "200px";
  LOADING.TEXT.innerText = "Tap continue";
    //Audio manangement below
  const AUDIO = document.getElementsByClassName("aud");
  window.addEventListener("click",()=>{
    LOADING.BODY.style.display = "none";
    AUDIO[0].play();
    AUDIO[0].loop = true;
  })
  // 0 means background music
  //GameScreen
  const GAME_SCREEN = document.getElementById("game");
  const ctx = GAME_SCREEN.getContext("2d");
  GAME_SCREEN.width = window.innerWidth;
  GAME_SCREEN.height = window.innerHeight;
  const tm = document.getElementById("ou");
  function log(t) {
    tm.innerHTML = t;
  }

  
  //reize control
  window.addEventListener("resize", ()=> {
    location.reload();
    GAME_SCREEN.width = window.innerWidth;
    GAME_SCREEN.height = window.innerHeight;
  })
  //Images below here
  const IMAGE = document.getElementsByClassName("imgs");
  const img = {
    player: IMAGE[0],
  }
  //Arrays
  const ary = {
    path: [],
  }
  //Player blueprint
  class Player {
    constructor () {
      this.x = 0;
      this.width = 30;
      this.height = 70;

      this.y = GAME_SCREEN.height-45;
      this.mass = 60;
      this.ground = this.y;
      this.lastGround = this.ground;
      this.gravity = 0.0098*this.mass;
      this.speed = 5;
      this.speedY = 0;
      this.moveX = 0;
      this.JumpX = 0;
      this.acc = 0;
      this.gravityX = false;
      this.t = 0;
      this.sy = 210;
      this.sx = 0;
      this.sw = (210/133)*this.width
    }
    movement() {
      if (this.x < 0 || this.x > GAME_SCREEN.width-this.width) {
        this.x = (this.x < 0)? 0: GAME_SCREEN.width-this.width;
        this.moveX = 0;
        return;
      }
      this.x += this.speed*this.moveX;
    }
    jump() {
      if (this.JumpX && this.y == this.ground) {
        this.speedY = -11;
        this.JumpX= 0;
        this.acc = this.gravity;
      }
      this.gravityX = !this.JumpX;
    }
    Gravity () {
      if (this.y < this.ground && this.gravityX) {
        this.acc = this.gravity
      } else if (this.y > this.ground&&!this.JumpX) {
        this.y = this.ground;
        this.acc = 0;
        this.speedY = 0;
        this.JumpX = 0;
      }
      this.speedY += this.acc;
      this.y += this.speedY;
   //   log(this.speedY+" "+this.y+" "+this.ground+" "+this.JumpX)
    }

    animation() {
      this.t++
      if (this.t%5 === 0) {
        this.sx += 133*this.moveX
      }
      if (this.sx >= 700 && this.moveX > 0) {
        this.sx = 0
      } else if (this.sx <= 0 && this.moveX < 0) {
        this.sx = 800-this.sw-70;
      }
      window.addEventListener("touchstart", ()=> {
        this.sy = (this.moveX > 0)?210: 0;
      })
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = "red";
      // ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(img.player, this.sx, this.sy, 133, 200, this.x, this.y-this.height, (200/133)*this.width, this.height)
      ctx.fill();
      ctx.closePath();
    }
  }
  //createPlayer
  const Gamer = new Player();
  function createPlayer() {
    Gamer.draw();
    Gamer.movement();
    Gamer.Gravity();
    Gamer.jump();
    Gamer.animation();
  }
  //Ground creation
  class Path {
    constructor(x, y, width) {
      this.x = x;
      this.y = GAME_SCREEN.height-(y*75+50);
      this.width = width;
      this.height = 30;
      this.colliedHeight = 10
      this.stand = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.fillRect(this.x, this.y, this.width, this.colliedHeight);
      ctx.fill();
      ctx.closePath();
    }
  }

  function createPath(x, y, width) {
    ary.path.push(new Path(x, y, width));
  }
  createPath(10, 1, 200);
  createPath(200, 2, 150);
  createPath(20,3,100)
  function handlePath() {
    for (let i = 0; i < ary.path.length; i++) {
      const PATHS = ary.path[i];
      PATHS.draw();
      if (collusion(Gamer, PATHS)) {
        if (Gamer.y <= PATHS.y+10) {
          Gamer.ground = PATHS.y
        }
        if (Gamer.y > PATHS.y+10) {
          if (Gamer.x+Gamer.width > PATHS.x && Gamer.x < PATHS.x+5) {
            Gamer.x = PATHS.x-1-Gamer.width;
          } else if (Gamer.x > PATHS.x && Gamer.x > PATHS.x+PATHS.width-5) {
            Gamer.x = PATHS.x+PATHS.width+1
          }
          Gamer.y = Gamer.ground
          Gamer.speedY = 0;
        }
      }
    }
   //Falling conditionworks on  this
    for (let i = 0; i < ary.path.length; i++) {
      const PATHS = ary.path[i];
      if (collusion(Gamer, PATHS)) {
        break;
      }else if(i == ary.path.length-1){
        Gamer.ground = GAME_SCREEN.height-45
      }
    }
    ////////
  }
  //obstacles
  //collusion
  function collusion(first, second) {
    if (!(first.x > second.x+second.width || first.x+first.width < second.x || first.y > second.y+second.height || first.y+first.height < second.y)) {
      return true;
    }
  }
  function collusionX(first, second) {
    if (!(first.x > second.x+second.width || first.x+first.width < second.x)) {
      return true;
    }
  }
  function collusionY(first, second) {
    if (!(first.y > second.y+second.height || first.y+first.height < second.y)) {
      return true;
    }
  }
  //control Button code here
  const ControlBtn = document.getElementsByClassName("ctrlBtn");
  //0,1,2 means right,left,jump respectively
  ControlBtn[0].addEventListener("touchstart", ()=> {
    Gamer.moveX=-1
  });
  ControlBtn[1].addEventListener("touchstart", ()=> {
    Gamer.moveX = 1;
  });
  ControlBtn[2].addEventListener("touchstart", ()=> {
    Gamer.JumpX = 1;
  });
  for (let i = 0; i < 2; i++) {
    ControlBtn[i].addEventListener("touchend", ()=> {
      Gamer.moveX = 0;
    })
  }
  //animation
  function animation () {
    ctx.clearRect(0, 0, GAME_SCREEN.width, GAME_SCREEN.height);
    //functions below here
    handlePath();
    createPlayer();
    //Temporary path or ground
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, GAME_SCREEN.height-50, GAME_SCREEN.width, 100);
    ctx.fill();
    ctx.closePath();
    requestAnimationFrame(animation);
  }

  animation();
});