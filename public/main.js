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
let playerImg = document.getElementById('player');
class Player {
  constructor () {
    
    this.x = 10;
    this.width = 30;
    this.height = 70;
    this.y = GAME_SCREEN.height-100-this.height;
    this.mass = 60;
    this.ground = this.y;
    this.gravity = 0.0098*this.mass;
    this.speed = 1;
    this.speedY= 0;
    this.moveX = 0;
    this.JumpX = 0;
    this.acc = 0;
    this.gravityX=false;
    this.sx = 0;
    this.t = 0;
  }
  movement() {
    if (this.x < 0 || this.x > GAME_SCREEN.width-this.width) {
      this.x = (this.x < 0)? 0: GAME_SCREEN.width-this.width;
      this.moveX = 0;
      return;
    }
    
   if(this.sx >= 1600 || this.sx <= 0){
     this.sx = 0
   }
    this.x += this.speed*this.moveX;
  }
  jump() {
   if (this.JumpX && this.y == this.ground) {
      this.speedY= -13;
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
  animation(){
    this.t++
   if(this.t%10===0){
    this.sx += 230*this.moveX
   }
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = "red";
   // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(playerImg,this.sx,290,230,300,this.x,this.y,(230/300)*this.width,this.height)
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
  Gamer.animation();
}

const ControlBtn = document.getElementsByClassName("ctrlBtn");
ControlBtn[0].addEventListener("touchstart", ()=> {
  Gamer.moveX=-1
});
ControlBtn[1].addEventListener("touchstart", ()=> {
  Gamer.moveX = 1;
});
ControlBtn[2].addEventListener("touchstart", ()=> {
  Gamer.JumpX=1;
});
for(let i = 0;i<2;i++){
ControlBtn[i].addEventListener("touchend", ()=> {
  Gamer.moveX = 0;
})
}
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