// ===== CANVAS SETUP =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

let groundY;
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    groundY = canvas.height - 100; // 100px ground height
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===== GAME SETTINGS =====
const gravity = 0.6;

// ===== PLAYER 1 =====
const player1 = {
    x: 200,
    y: 0,
    width: 20,
    height: 40,
    color: "white",
    vx: 0,
    vy: 0,
    speed: 6,
    jumpPower: 14,
    onGround: true,
    health: 100
};

// ===== PLAYER 2 =====
const player2 = {
    x: 900,
    y: 0,
    width: 20,
    height: 40,
    color: "red",
    vx: 0,
    vy: 0,
    speed: 6,
    jumpPower: 14,
    onGround: true,
    health: 100
};

// ===== INPUT =====
const keys = {};

window.addEventListener("keydown", e => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault();
    keys[e.code] = true;
});
window.addEventListener("keyup", e => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault();
    keys[e.code] = false;
});

// ===== ATTACK SETTINGS =====
const attackDuration = 10; 
const attackRange = 40; // wider range for knockback
let player1Attack = 0;
let player2Attack = 0;
const attackDamage = 10;
const knockbackPower = 25;

// ===== HELPER FUNCTIONS =====
function rectCollision(r1, r2) {
    return r1.x < r2.x + r2.width &&
           r1.x + r1.width > r2.x &&
           r1.y < r2.y + r2.height &&
           r1.y + r1.height > r2.y;
}

function updatePlayer(p, leftKey, rightKey, jumpKey, attackKey, attackFlag) {
    // Movement
    p.vx = 0;
    if (keys[leftKey]) p.vx = -p.speed;
    else if (keys[rightKey]) p.vx = p.speed;
    
    // Jump
    if (keys[jumpKey] && p.onGround) {
        p.vy = -p.jumpPower;
        p.onGround = false;
    }

    // Gravity
    p.vy += gravity;
    p.x += p.vx;
    p.y += p.vy;

    // Ground collision
    if (p.y >= groundY) {
        p.y = groundY;
        p.vy = 0;
        p.onGround = true;
    }

    // Bounds
    if (p.x < 0) p.x = 0;
    if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;

    // Attack input
    if (keys[attackKey] && attackFlag.value === 0) attackFlag.value = attackDuration;
    if (attackFlag.value > 0) attackFlag.value--;
}

// ===== UPDATE LOOP =====
function update() {
    updatePlayer(player1, "KeyA", "KeyD", "KeyW", "KeyF", {value: player1Attack});
    updatePlayer(player2, "ArrowLeft", "ArrowRight", "ArrowUp", "Slash", {value: player2Attack});

    // Player 1 attack
    if (player1Attack > 0) {
        const hitBox = {x: player1.x + player1.width, y: player1.y, width: attackRange, height: player1.height};
        if (rectCollision(hitBox, player2)) {
            player2.x += knockbackPower;
            player2.health -= attackDamage;
            if (player2.health < 0) player2.health = 0;
        }
    }

    // Player 2 attack
    if (player2Attack > 0) {
        const hitBox = {x: player2.x - attackRange, y: player2.y, width: attackRange, height: player2.height};
        if (rectCollision(hitBox, player1)) {
            player1.x -= knockbackPower;
            player1.health -= attackDamage;
            if (player1.health < 0) player1.health = 0;
        }
    }
}

// ===== DRAW =====
function drawPlayer(p) {
    ctx.fillStyle = p.color;
    // Body
    ctx.fillRect(p.x, p.y, p.width, p.height);
    // Head
    ctx.fillRect(p.x + 5, p.y - 15, 10, 10);
    // Arms
    ctx.fillRect(p.x - 5, p.y + 5, 5, 20);
    ctx.fillRect(p.x + p.width, p.y + 5, 5, 20);
    // Legs
    ctx.fillRect(p.x + 3, p.y + p.height, 5, 15);
    ctx.fillRect(p.x + 12, p.y + p.height, 5, 15);
}

function drawHealthBars() {
    const barWidth = 300;
    const barHeight = 20;

    // Player 1
    ctx.fillStyle = "#333";
    ctx.fillRect(50, 50, barWidth, barHeight);
    ctx.fillStyle = "white";
    ctx.fillRect(50, 50, barWidth * (player1.health / 100), barHeight);
    ctx.strokeStyle = "black";
    ctx.strokeRect(50, 50, barWidth, barHeight);

    // Player 2
    ctx.fillStyle = "#333";
    ctx.fillRect(canvas.width - 50 - barWidth, 50, barWidth, barHeight);
    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width - 50 - barWidth, 50, barWidth * (player2.health / 100), barHeight);
    ctx.strokeStyle = "black";
    ctx.strokeRect(canvas.width - 50 - barWidth, 50, barWidth, barHeight);
}

function draw() {
    // Background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = "#444";
    ctx.fillRect(0, groundY, canvas.width, 100);

    // Players
    drawPlayer(player1);
    drawPlayer(player2);

    // Attack hitboxes for debugging
    if (player1Attack > 0) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(player1.x + player1.width, player1.y, attackRange, player1.height);
    }
    if (player2Attack > 0) {
        ctx.fillStyle = "orange";
        ctx.fillRect(player2.x - attackRange, player2.y, attackRange, player2.height);
    }

    // Health bars
    drawHealthBars();
}

// ===== GAME LOOP =====
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
