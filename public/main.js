//var socket = io();

window.addEventListener("load", ()=> {
  //load Function
  const LOADING ={
    TEXT : document.getElementById("ltxt"),
    PROGRESS :document.getElementById('prog'),
    BODY: document.getElementById('loadbody')
  }
  LOADING.PROGRESS.style.width = "200px";
  LOADING.TEXT.innerText = "Loaded"
  setTimeout(()=>{
    LOADING.BODY.style.display = "none";
  },1000)
  
  //GameScreen
  const GAME_SCREEN = document.getElementById("game");
  const ctx = GAME_SCREEN.getContext("2d");
  GAME_SCREEN.width = window.innerWidth;
  GAME_SCREEN.height = window.innerHeight;
  const tm = document.getElementById("ou");
  function log(t) {
    // tm.innerHTML=t;
  }
  //Audio manangement below
  const AUDIO = document.getElementsByClassName("aud");
  // 0 means background music
  AUDIO[0].play();
  AUDIO[0].loop = true;
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
  //Player blueprint
  class Player {
    constructor () {
      this.x = 10;
      this.width = 60;
      this.height = 100;
      this.y = GAME_SCREEN.height-95-this.height;
      this.mass = 60;
      this.ground = this.y;
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
      this.sw = (210/134)*this.width
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
        this.speedY = -13;
        this.acc = this.gravity;
        this.gravityX = !this.JumpX;
      }
    }
    Gravity () {
      if (this.y < this.ground && this.gravityX) {
        this.acc = this.gravity
      } else if (this.y >= this.ground+1) {
        this.y = this.ground;
        this.acc = 0;
        this.speedY = 0;
        this.JumpX = 0;
      }
      this.speedY += this.acc;
      log(this.speedY+" "+this.acc)
      this.y += this.speedY;
    }
    animation() {
      this.t++
      if (this.t%5 === 0) {
        this.sx += 133*this.moveX
      }
      if (this.sx >= 700 && this.moveX > 0) {
        this.sx = 0
      } else if (this.sx <= 0 && this.moveX < 0) {
        this.sx = 800-this.sw-40;
      }
      window.addEventListener("touchstart", ()=> {
        this.sy = (this.moveX > 0)?210: 0;
      })
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = "red";
      // ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(img.player, this.sx, this.sy, 133, 200, this.x, this.y, (200/133)*this.width, this.height)
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
  class Path{
    constructor(x,y,width){
      this.x =x;
      this.y = y;
      this.width = width;
      this.height = 200;
    }
  }
  //obstacles
  
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
    createPlayer();
    //Temporary path or ground
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, GAME_SCREEN.height-100, GAME_SCREEN.width, 100);
    ctx.fill();
    ctx.closePath();
    requestAnimationFrame(animation);
  }

  animation();
});