// ===== CANVAS =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let groundY;

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    groundY = canvas.height - 100;
}
window.addEventListener("resize", resize);
resize();

// ===== PLAYER FACTORY =====
function createPlayer(x,color){
    return {
        x, y:0,
        width:30, height:60,
        color,
        vx:0, vy:0,
        speed:6,
        jumpPower:14,
        onGround:true,
        health:100,
        facing:"right",
        punch:0,
        kick:0,
        special:0,
        block:false,
        hitstun:0,
        combo:0,
        flash:0
    };
}

const player1 = createPlayer(canvas.width/2-150,"white");
const player2 = createPlayer(canvas.width/2+150,"red");

player1.y = groundY;
player2.y = groundY;

// ===== INPUT =====
const keys = {};
window.addEventListener("keydown",e=>keys[e.code]=true);
window.addEventListener("keyup",e=>keys[e.code]=false);

// ===== CONSTANTS =====
const gravity = 0.6;
const attackDuration = 12;
const attackRange = 50;
const damage = 8;
const specialDamage = 20;
const knockback = 20;

// ===== COLLISION =====
function collide(a,b){
    return a.x < b.x+b.width &&
           a.x+a.width > b.x &&
           a.y < b.y+b.height &&
           a.y+a.height > b.y;
}

// ===== UPDATE PLAYER =====
function updatePlayer(p,controls,op){
    if(p.hitstun>0){
        p.hitstun--;
        return;
    }

    // Facing logic
    p.facing = p.x < op.x ? "right" : "left";

    // Movement
    p.vx = 0;
    if(keys[controls.left]) p.vx = -p.speed;
    if(keys[controls.right]) p.vx = p.speed;

    if(keys[controls.jump] && p.onGround){
        p.vy = -p.jumpPower;
        p.onGround = false;
    }

    p.block = keys[controls.block];

    p.vy += gravity;
    p.x += p.vx;
    p.y += p.vy;

    if(p.y >= groundY){
        p.y = groundY;
        p.vy = 0;
        p.onGround = true;
    }

    if(p.x<0) p.x=0;
    if(p.x+p.width>canvas.width) p.x=canvas.width-p.width;

    // Punch
    if(keys[controls.punch] && p.punch===0) p.punch=attackDuration;

    if(p.punch>0){
        p.punch--;
        tryHit(p,op,damage);
    }

    // Kick
    if(keys[controls.kick] && p.kick===0) p.kick=attackDuration;

    if(p.kick>0){
        p.kick--;
        tryHit(p,op,damage+4);
    }

    // Special (air or ground)
    if(keys[controls.special] && p.special===0){
        p.special=20;
    }

    if(p.special>0){
        p.special--;
        tryHit(p,op,specialDamage);
    }
}

function tryHit(attacker,defender,dmg){
    const hitbox={
        x: attacker.facing==="right" ? attacker.x+attacker.width : attacker.x-attackRange,
        y: attacker.y,
        width: attackRange,
        height: attacker.height
    };

    if(collide(hitbox,defender)){
        let finalDamage = defender.block ? dmg*0.3 : dmg;
        defender.health -= finalDamage;
        if(defender.health<0) defender.health=0;

        defender.hitstun = defender.block ? 5 : 15;
        defender.x += attacker.facing==="right" ? knockback : -knockback;

        defender.flash = 5;
        attacker.combo++;
    }
}

// ===== DRAW PLAYER =====
function drawPlayer(p){
    ctx.save();
    ctx.translate(p.x+p.width/2,p.y+p.height/2);

    const flip = p.facing==="left" ? -1 : 1;
    ctx.scale(flip,1);

    ctx.fillStyle=p.flash>0?"orange":p.color;
    ctx.fillRect(-p.width/2,-p.height/2,p.width,p.height);

    ctx.fillRect(-10,-p.height/2-20,20,20);

    if(p.block){
        ctx.fillStyle="blue";
        ctx.fillRect(-p.width/2-10,-p.height/2,10,p.height);
    }

    if(p.flash>0) p.flash--;

    ctx.restore();
}

// ===== HEALTH BARS =====
function drawHealth(){
    const w=400,h=40;

    ctx.fillStyle="#333";
    ctx.fillRect(50,50,w,h);
    ctx.fillStyle="white";
    ctx.fillRect(50,50,w*(player1.health/100),h);

    ctx.fillStyle="#333";
    ctx.fillRect(canvas.width-50-w,50,w,h);
    ctx.fillStyle="red";
    ctx.fillRect(canvas.width-50-w,50,w*(player2.health/100),h);
}

// ===== WIN CHECK =====
function checkWin(){
    if(player1.health<=0 || player2.health<=0){
        ctx.fillStyle="yellow";
        ctx.font="60px Arial";
        ctx.fillText(
            player1.health<=0 ? "PLAYER 2 WINS" : "PLAYER 1 WINS",
            canvas.width/2-200,
            canvas.height/2
        );
        return true;
    }
    return false;
}

// ===== DRAW =====
function draw(){
    ctx.fillStyle="#222";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="#444";
    ctx.fillRect(0,groundY,canvas.width,100);

    drawPlayer(player1);
    drawPlayer(player2);
    drawHealth();
}

// ===== CONTROLS =====
const controls1={
    left:"KeyA",
    right:"KeyD",
    jump:"KeyW",
    punch:"KeyF",
    kick:"KeyG",
    block:"KeyS",
    special:"KeyR"
};

const controls2={
    left:"ArrowLeft",
    right:"ArrowRight",
    jump:"ArrowUp",
    punch:"Slash",
    kick:"ShiftRight",
    block:"ArrowDown",
    special:"Period"
};

// ===== GAME LOOP =====
function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    updatePlayer(player1,controls1,player2);
    updatePlayer(player2,controls2,player1);

    draw();

    if(!checkWin()){
        requestAnimationFrame(loop);
    }
}
loop();
