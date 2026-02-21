// ===== CANVAS SETUP =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let groundY;

// ===== PLAYERS =====
const player1 = { x: 200, y: 0, width: 20, height: 40, color: "white", vx: 0, vy: 0, speed: 6, jumpPower: 14, onGround: true, health: 100 };
const player2 = { x: 900, y: 0, width: 20, height: 40, color: "red", vx: 0, vy: 0, speed: 6, jumpPower: 14, onGround: true, health: 100 };

// ===== ATTACK SETTINGS =====
let player1Attack = 0, player2Attack = 0;
const attackDuration = 10, attackRange = 40, attackDamage = 10, knockbackPower = 25;

// ===== INPUT =====
const keys = {};
window.addEventListener("keydown", e => { keys[e.code] = true; });
window.addEventListener("keyup", e => { keys[e.code] = false; });

// ===== RESIZE CANVAS & INIT PLAYERS =====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    groundY = canvas.height - 100;
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
function updatePlayer(p, leftKey, rightKey, jumpKey, attackKey, attackVar) {
    p.vx = 0;
    if (keys[leftKey]) p.vx = -p.speed;
    else if (keys[rightKey]) p.vx = p.speed;
    if (keys[jumpKey] && p.onGround) { p.vy = -p.jumpPower; p.onGround = false; }
    p.vy += 0.6;
    p.x += p.vx; p.y += p.vy;
    if (p.y >= groundY) { p.y = groundY; p.vy = 0; p.onGround = true; }
    if (p.x < 0) p.x = 0;
    if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;
    if (keys[attackKey] && attackVar.value === 0) attackVar.value = attackDuration;
    if (attackVar.value > 0) attackVar.value--;
}

// ===== UPDATE LOOP =====
function update() {
    updatePlayer(player1,"KeyA","KeyD","KeyW","KeyF",{value:player1Attack});
    updatePlayer(player2,"ArrowLeft","ArrowRight","ArrowUp","Slash",{value:player2Attack});

    if (player1Attack>0){const hit={x:player1.x+player1.width,y:player1.y,width:attackRange,height:player1.height}; if(rectCollision(hit,player2)){player2.x+=knockbackPower; player2.health-=attackDamage;if(player2.health<0)player2.health=0;} player1Attack--;}
    if (player2Attack>0){const hit={x:player2.x-attackRange,y:player2.y,width:attackRange,height:player2.height}; if(rectCollision(hit,player1)){player1.x-=knockbackPower; player1.health-=attackDamage;if(player1.health<0)player1.health=0;} player2Attack--;}
}

// ===== DRAW =====
function drawPlayer(p){
    ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,p.width,p.height);
    ctx.fillRect(p.x+5,p.y-15,10,10); ctx.fillRect(p.x-5,p.y+5,5,20); ctx.fillRect(p.x+p.width,p.y+5,5,20);
    ctx.fillRect(p.x+3,p.y+p.height,5,15); ctx.fillRect(p.x+12,p.y+p.height,5,15);
}

function drawHealthBars(){
    const barW=300,barH=20;
    ctx.fillStyle="#333"; ctx.fillRect(50,50,barW,barH);
    ctx.fillStyle="white"; ctx.fillRect(50,50,barW*(player1.health/100),barH);
    ctx.strokeStyle="black"; ctx.strokeRect(50,50,barW,barH);
    ctx.fillStyle="#333"; ctx.fillRect(canvas.width-50-barW,50,barW,barH);
    ctx.fillStyle="red"; ctx.fillRect(canvas.width-50-barW,50,barW*(player2.health/100),barH);
    ctx.strokeStyle="black"; ctx.strokeRect(canvas.width-50-barW,50,barW,barH);
}

function draw(){
    ctx.fillStyle="#222"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#444"; ctx.fillRect(0,groundY,canvas.width,100);
    drawPlayer(player1); drawPlayer(player2);
    if(player1Attack>0){ctx.fillStyle="yellow";ctx.fillRect(player1.x+player1.width,player1.y,attackRange,player1.height);}
    if(player2Attack>0){ctx.fillStyle="orange";ctx.fillRect(player2.x-attackRange,player2.y,attackRange,player2.height);}
    drawHealthBars();
}

// ===== GAME LOOP =====
function gameLoop(){update(); draw(); requestAnimationFrame(gameLoop);}
gameLoop();
