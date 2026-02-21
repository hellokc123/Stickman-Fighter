// ===== CANVAS SETUP =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let groundY;

// ===== PLAYERS =====
const player1 = { 
    x: 0, y: 0, width: 30, height: 60, color: "white", vx: 0, vy: 0, 
    speed: 6, jumpPower: 14, onGround: true, health: 100, punch: 0, kick: 0, punchAngle: 0, kickAngle: 0
};
const player2 = { 
    x: 0, y: 0, width: 30, height: 60, color: "red", vx: 0, vy: 0, 
    speed: 6, jumpPower: 14, onGround: true, health: 100, punch: 0, kick: 0, punchAngle: 0, kickAngle: 0
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
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    groundY = canvas.height - 100;

    player1.x = canvas.width / 2 - 150;
    player2.x = canvas.width / 2 + 150;
    player1.y = groundY;
    player2.y = groundY;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===== HELPERS =====
function rectCollision(r1, r2) {
    return r1.x < r2.x + r2.width &&
           r1.x + r1.width > r2.x &&
           r1.y < r2.y + r2.height &&
           r1.y + r1.height > r2.y;
}

// ===== UPDATE PLAYER =====
function updatePlayer(p, leftKey, rightKey, jumpKey, punchKey, kickKey) {
    p.vx = 0;
    if (keys[leftKey]) p.vx = -p.speed;
    else if (keys[rightKey]) p.vx = p.speed;

    if (keys[jumpKey] && p.onGround) { p.vy = -p.jumpPower; p.onGround = false; }

    p.vy += 0.6;
    p.x += p.vx;
    p.y += p.vy;

    if (p.y >= groundY) { p.y = groundY; p.vy = 0; p.onGround = true; }
    if (p.x < 0) p.x = 0;
    if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;

    // Punch input
    if (keys[punchKey] && p.punch === 0) p.punch = attackDuration;
    if (p.punch > 0) { p.punchAngle = (p.punch / attackDuration) * Math.PI/2; p.punch--; } 
    else p.punchAngle = 0;

    // Kick input
    if (keys[kickKey] && p.kick === 0) p.kick = attackDuration;
    if (p.kick > 0) { p.kickAngle = (p.kick / attackDuration) * Math.PI/3; p.kick--; } 
    else p.kickAngle = 0;
}

// ===== UPDATE LOOP =====
function update() {
    updatePlayer(player1,"KeyA","KeyD","KeyW","KeyF","KeyG");
    updatePlayer(player2,"ArrowLeft","ArrowRight","ArrowUp","Slash","ShiftRight");

    // Punch hit detection
    if(player1.punch>0){
        const hit = {x:player1.x + player1.width, y:player1.y, width:attackRange, height:player1.height};
        if(rectCollision(hit,player2)){
            player2.x += knockbackPower;
            player2.health -= attackDamage;
            if(player2.health<0) player2.health=0;
            flashHit(player2);
        }
    }
    if(player2.punch>0){
        const hit = {x:player2.x - attackRange, y:player2.y, width:attackRange, height:player2.height};
        if(rectCollision(hit,player1)){
            player1.x -= knockbackPower;
            player1.health -= attackDamage;
            if(player1.health<0) player1.health=0;
            flashHit(player1);
        }
    }

    // Kick hit detection
    if(player1.kick>0){
        const hit = {x:player1.x + player1.width, y:player1.y + 20, width:attackRange, height:20};
        if(rectCollision(hit,player2)){
            player2.x += knockbackPower/2;
            player2.health -= attackDamage;
            if(player2.health<0) player2.health=0;
            flashHit(player2);
        }
    }
    if(player2.kick>0){
        const hit = {x:player2.x - attackRange, y:player2.y + 20, width:attackRange, height:20};
        if(rectCollision(hit,player1)){
            player1.x -= knockbackPower/2;
            player1.health -= attackDamage;
            if(player1.health<0) player1.health=0;
            flashHit(player1);
        }
    }
}

// ===== HIT FLASH =====
const flashDuration = 5;
function flashHit(p){ p.flash = flashDuration; }

// ===== DRAW =====
function drawPlayer(p, facing="right"){
    ctx.save();
    ctx.translate(p.x + p.width/2, p.y + p.height/2);
    const flip = facing==="left"?-1:1;

    // Body
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.width/2, -p.height/2, p.width, p.height);

    // Head
    ctx.fillRect(-10, -p.height/2 - 20, 20, 20);

    // Legs
    // Left leg
    ctx.save();
    ctx.translate(-p.width/2 + 5, p.height/2);
    ctx.rotate(flip * p.kickAngle);
    ctx.fillRect(0, 0, 7, 20);
    ctx.restore();
    // Right leg
    ctx.save();
    ctx.translate(p.width/2 - 12, p.height/2);
    ctx.rotate(flip * p.kickAngle/2);
    ctx.fillRect(0,0,7,20);
    ctx.restore();

    // Left arm
    ctx.fillRect(-p.width/2 - 5, -p.height/2 + 10, 5, 25);

    // Right arm (punch)
    ctx.save();
    ctx.translate(p.width/2, -p.height/2 + 10);
    ctx.rotate(flip * p.punchAngle);
    ctx.fillStyle="yellow";
    ctx.fillRect(0,0,5,25);
    ctx.restore();

    // Flash if hit
    if(p.flash>0){
        ctx.fillStyle="red";
        ctx.fillRect(-p.width/2,-p.height/2,p.width,p.height);
        p.flash--;
    }

    ctx.restore();
}

// Health bars
function drawHealthBars(){
    const barW = 400, barH = 40;
    ctx.fillStyle="#333"; ctx.fillRect(50,50,barW,barH);
    ctx.fillStyle="white"; ctx.fillRect(50,50,barW*(player1.health/100),barH);
    ctx.strokeStyle="black"; ctx.strokeRect(50,50,barW,barH);

    ctx.fillStyle="#333"; ctx.fillRect(canvas.width-50-barW,50,barW,barH);
    ctx.fillStyle="red"; ctx.fillRect(canvas.width-50-barW,50,barW*(player2.health/100),barH);
    ctx.strokeStyle="black"; ctx.strokeRect(canvas.width-50-barW,50,barW,barH);
}

// ===== DRAW LOOP =====
function draw(){
    ctx.fillStyle="#222"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#444"; ctx.fillRect(0, groundY, canvas.width, 100);

    // Middle line
    ctx.strokeStyle="#888";
    ctx.lineWidth=4;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, groundY-200);
    ctx.lineTo(canvas.width/2,canvas.height);
    ctx.stroke();

    drawPlayer(player1,"right");
    drawPlayer(player2,"left");

    drawHealthBars();
}

// ===== GAME LOOP =====
function gameLoop(){ update(); draw(); requestAnimationFrame(gameLoop); }
gameLoop();
