// ===== CANVAS SETUP =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let groundY;

// ===== PLAYERS =====
const player1 = { 
    x: 0, y: 0, width: 30, height: 60, color: "white", vx: 0, vy: 0, 
    speed: 6, jumpPower: 14, onGround: true, health: 100, attack: 0 
};
const player2 = { 
    x: 0, y: 0, width: 30, height: 60, color: "red", vx: 0, vy: 0, 
    speed: 6, jumpPower: 14, onGround: true, health: 100, attack: 0 
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

    // Start players in the middle (facing each other)
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
function updatePlayer(p, leftKey, rightKey, jumpKey, attackKey) {
    p.vx = 0;
    if (keys[leftKey]) p.vx = -p.speed;
    else if (keys[rightKey]) p.vx = p.speed;

    if (keys[jumpKey] && p.onGround) {
        p.vy = -p.jumpPower;
        p.onGround = false;
    }

    p.vy += 0.6;
    p.x += p.vx; p.y += p.vy;

    if (p.y >= groundY) { p.y = groundY; p.vy = 0; p.onGround = true; }
    if (p.x < 0) p.x = 0;
    if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;

    if (keys[attackKey] && p.attack === 0) p.attack = attackDuration;
    if (p.attack > 0) p.attack--;
}

// ===== UPDATE LOOP =====
function update() {
    updatePlayer(player1, "KeyA", "KeyD", "KeyW", "KeyF");
    updatePlayer(player2, "ArrowLeft", "ArrowRight", "ArrowUp", "Slash");

    // Player1 attack
    if (player1.attack > 0) {
        const hit = { x: player1.x + player1.width, y: player1.y, width: attackRange, height: player1.height };
        if (rectCollision(hit, player2)) {
            player2.x += knockbackPower;
            player2.health -= attackDamage;
            if (player2.health < 0) player2.health = 0;
        }
    }

    // Player2 attack
    if (player2.attack > 0) {
        const hit = { x: player2.x - attackRange, y: player2.y, width: attackRange, height: player2.height };
        if (rectCollision(hit, player1)) {
            player1.x -= knockbackPower;
            player1.health -= attackDamage;
            if (player1.health < 0) player1.health = 0;
        }
    }
}

// ===== DRAW =====
function drawPlayer(p){
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);
    ctx.fillRect(p.x + 5, p.y - 20, 20, 20); // head
    ctx.fillRect(p.x - 5, p.y + 10, 5, 25); // left arm
    ctx.fillRect(p.x + p.width, p.y + 10, 5, 25); // right arm
    ctx.fillRect(p.x + 5, p.y + p.height, 7, 20); // left leg
    ctx.fillRect(p.x + 18, p.y + p.height, 7, 20); // right leg

    // Swing arm when attacking
    if (p.attack > 0) {
        ctx.fillStyle = "yellow";
        if (p === player1) ctx.fillRect(p.x + p.width, p.y + 10, attackRange, 8);
        if (p === player2) ctx.fillRect(p.x - attackRange, p.y + 10, attackRange, 8);
    }
}

function drawHealthBars(){
    const barW = 400; // bigger
    const barH = 40;  // taller

    // Player1
    ctx.fillStyle = "#333";
    ctx.fillRect(50, 50, barW, barH);
    ctx.fillStyle = "white";
    ctx.fillRect(50, 50, barW * (player1.health / 100), barH);
    ctx.strokeStyle = "black";
    ctx.strokeRect(50, 50, barW, barH);

    // Player2
    ctx.fillStyle = "#333";
    ctx.fillRect(canvas.width - 50 - barW, 50, barW, barH);
    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width - 50 - barW, 50, barW * (player2.health / 100), barH);
    ctx.strokeStyle = "black";
    ctx.strokeRect(canvas.width - 50 - barW, 50, barW, barH);
}

function draw(){
    ctx.fillStyle = "#222";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Ground
    ctx.fillStyle = "#444";
    ctx.fillRect(0, groundY, canvas.width, 100);

    // Middle border line
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, groundY - 200);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    drawPlayer(player1);
    drawPlayer(player2);

    drawHealthBars();
}

// ===== GAME LOOP =====
function gameLoop(){ update(); draw(); requestAnimationFrame(gameLoop); }
gameLoop();
