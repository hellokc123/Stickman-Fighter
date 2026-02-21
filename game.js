// ===== CANVAS SETUP =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let groundY;

// ===== PLAYERS =====
const player1 = { 
    x:0, y:0, width:30, height:60, color:"white", vx:0, vy:0, speed:6, jumpPower:14, 
    onGround:true, health:100, punch:0, kick:0, punchAngle:0, kickAngle:0, flash:0, facing:"right"
};
const player2 = { 
    x:0, y:0, width:30, height:60, color:"red", vx:0, vy:0, speed:6, jumpPower:14, 
    onGround:true, health:100, punch:0, kick:0, punchAngle:0, kickAngle:0, flash:0, facing:"left"
};

// ===== ATTACK SETTINGS =====
const attackDuration = 10;
const attackRange = 50;
const attackDamage = 10;
const knockbackPower = 25;

// ===== INPUT =====
const keys = {};
window.addEventListener("keydown", e => { keys[e.code] = true; });
window.addEventListener("keyup", e => { keys[e.code] = false; });

// ===== RESIZE CANVAS & INIT PLAYERS =====
function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    groundY = canvas.height - 100;

    player1.x = canvas.width/2 - 150;
    player2.x = canvas.width/2 + 150;
    player1.y = groundY;
    player2.y = groundY;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===== HELPERS =====
function rectCollision(r1,r2){
    return r1.x < r2.x + r2.width &&
           r1.x + r1.width > r2.x &&
           r1.y < r2.y + r2.height &&
           r1.y + r1.height > r2.y;
}
function flashHit(p){ p.flash=5; }
function impactSpark(x,y){ 
    ctx.fillStyle="orange"; 
    ctx.fillRect(x,y,5,5);
}

// ===== UPDATE PLAYER =====
function updatePlayer(p,leftKey,rightKey,jumpKey,punchKey,kickKey,opponent){
    p.vx=0;
    if(keys[leftKey]){ p.vx=-p.speed; p.facing="right"; }
    if(keys[rightKey]){ p.vx=p.speed; p.facing="left"; }
    if(keys[jumpKey] && p.onGround){ p.vy=-p.jumpPower; p.onGround=false; }

    // Movement lean
    p.lean = p.vx * 0.05;

    // Gravity
    p.vy+=0.6;
    p.x+=p.vx; p.y+=p.vy;

    if(p.y>=groundY){ p.y=groundY; p.vy=0; p.onGround=true; }

    if(p.x<0) p.x=0;
    if(p.x+p.width>canvas.width) p.x=canvas.width - p.width;

    // Punch
    if(keys[punchKey] && p.punch===0) p.punch=attackDuration;
    if(p.punch>0){
        p.punchAngle=(p.punch/attackDuration)*Math.PI/2;
        p.punch--;
        let hit={x:p.facing==="right"?p.x+p.width:p.x-attackRange, y:p.y, width:attackRange, height:p.height};
        if(rectCollision(hit,opponent)){
            opponent.x += (p.facing==="right"? knockbackPower:-knockbackPower);
            opponent.health -= attackDamage;
            if(opponent.health<0) opponent.health=0;
            flashHit(opponent);
            impactSpark(opponent.x + opponent.width/2, opponent.y + opponent.height/2);
        }
    } else p.punchAngle=0;

    // Kick
    if(keys[kickKey] && p.kick===0) p.kick=attackDuration;
    if(p.kick>0){
        p.kickAngle=(p.kick/attackDuration)*Math.PI/3;
        p.kick--;
        let hit={x:p.facing==="right"?p.x+p.width:p.x-attackRange, y:p.y+20, width:attackRange, height:20};
        if(rectCollision(hit,opponent)){
            opponent.x += (p.facing==="right"? knockbackPower/2:-knockbackPower/2);
            opponent.health -= attackDamage;
            if(opponent.health<0) opponent.health=0;
            flashHit(opponent);
            impactSpark(opponent.x + opponent.width/2, opponent.y + opponent.height/2);
        }
    } else p.kickAngle=0;
}

// ===== DRAW PLAYER =====
function drawPlayer(p){
    ctx.save();
    ctx.translate(p.x+p.width/2, p.y+p.height/2);
    const flip=p.facing==="left"?-1:1;
    ctx.rotate(p.lean);

    // Body
    ctx.fillStyle=p.color; ctx.fillRect(-p.width/2, -p.height/2, p.width, p.height);
    // Head
    ctx.fillRect(-10, -p.height/2-20, 20, 20);

    // Legs
    ctx.save(); ctx.translate(-p.width/2+5,p.height/2); ctx.rotate(flip*p.kickAngle); ctx.fillRect(0,0,7,20); ctx.restore();
    ctx.save(); ctx.translate(p.width/2-12,p.height/2); ctx.rotate(flip*p.kickAngle/2); ctx.fillRect(0,0,7,20); ctx.restore();

    // Left arm
    ctx.fillRect(-p.width/2-5,-p.height/2+10,5,25);
    // Right arm (punch)
    ctx.save(); ctx.translate(p.width/2,-p.height/2+10); ctx.rotate(flip*p.punchAngle); ctx.fillStyle="yellow"; ctx.fillRect(0,0,5,25); ctx.restore();

    // Hit flash
    if(p.flash>0){ ctx.fillStyle="red"; ctx.fillRect(-p.width/2,-p.height/2,p.width,p.height); p.flash--; }

    ctx.restore();
}

// ===== HEALTH BARS =====
function drawHealthBars(){
    const barW=400, barH=40;
    // Player1
    ctx.fillStyle="#333"; ctx.fillRect(50,50,barW,barH);
    ctx.fillStyle=player1.health<30?"orange":"white";
    ctx.fillRect(50,50,barW*(player1.health/100),barH);
    ctx.strokeStyle="black"; ctx.strokeRect(50,50,barW,barH);
    // Player2
    ctx.fillStyle="#333"; ctx.fillRect(canvas.width-50-barW,50,barW,barH);
    ctx.fillStyle=player2.health<30?"orange":"red";
    ctx.fillRect(canvas.width-50-barW,50,barW*(player2.health/100),barH);
    ctx.strokeStyle="black"; ctx.strokeRect(canvas.width-50-barW,50,barW,barH);
}

// ===== DRAW LOOP =====
function draw(){
    ctx.fillStyle="#222"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#444"; ctx.fillRect(0, groundY, canvas.width,100);

    // Middle line
    ctx.strokeStyle="#888"; ctx.lineWidth=4;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, groundY-200);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();

    drawPlayer(player1);
    drawPlayer(player2);
    drawHealthBars();
}

// ===== GAME LOOP =====
function gameLoop(){ 
    updatePlayer(player1,"KeyA","KeyD","KeyW","KeyF","KeyG",player2);
    updatePlayer(player2,"ArrowLeft","ArrowRight","ArrowUp","Slash","ShiftRight",player1);
    draw();
    requestAnimationFrame(gameLoop); 
}
gameLoop();
