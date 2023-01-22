const GAME_SCREEN = document.getElementById("game");
const ctx = GAME_SCREEN.getContext("2d");
GAME_SCREEN.width = window.innerWidth;
GAME_SCREEN.height = window.innerHeight;
const tm= document.getElementById("ou");
function log(t){
 // tm.innerHTML=t;
}
window.addEventListener("resize",()=>{
  location.reload();
  GAME_SCREEN.width = window.innerWidth;
GAME_SCREEN.height = window.innerHeight;
})
class Player {
  constructor () {
    this.y = GAME_SCREEN.height-100-70;
    this.x = 10;
    this.width = 30;
    this.height = 70;
    this.mass = 10;
    this.ground = this.y;
    this.gravity = 0.0098*this.mass;
    this.speed = 2;
    this.speedY= 0;
    this.moveX = 0;
    this.JumpX = 0;
    this.acc = 0;
    this.gravityX=false;
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
      this.speedY= -2.7;
      this.acc=this.gravity;
      this.gravityX = !this.JumpX;
   }
  }
  Gravity (){
    if (this.y <this.ground &&this.gravityX) {
      this.acc = this.gravity
    }else if(this.y >=this.ground+1){
      this.y = this.ground;
      this.acc=0;
      this.speedY= 0;
      this.JumpX=0;
    }
    this.speedY+=this.acc;
    log(this.speedY+" "+this.acc)
    this.y += this.speedY;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }
}
const Gamer = new Player();
function createPlayer() {
  Gamer.draw();
  Gamer.movement();
  Gamer.Gravity();
  Gamer.jump();
}
const Jump = document.getElementsByClassName("ctrlBtn");
Jump[0].addEventListener("touchstart", ()=> {
  Gamer.moveX=-1
});
Jump[1].addEventListener("touchstart", ()=> {
  Gamer.moveX = 1;
});
Jump[2].addEventListener("touchstart", ()=> {
  Gamer.JumpX=1;
});
Jump[0 || 1].addEventListener("touchend", ()=> {
  Gamer.moveX = 0;
})


function animation () {
  ctx.clearRect(0, 0, GAME_SCREEN.width, GAME_SCREEN.height);
  createPlayer();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(0, GAME_SCREEN.height-100, GAME_SCREEN.width, 100);
  ctx.fill();
  ctx.closePath();
  requestAnimationFrame(animation);
}

animation();