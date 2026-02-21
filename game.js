// ===== CANVAS SETUP =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 600;

ctx.imageSmoothingEnabled = false;

// ===== SETTINGS =====
const gravity = 0.6;
const groundY = 500; // Ground Y position


// ===== PLAYER 1 =====
const player = {
    x: 200,
    y: groundY,
    width: 20,
    height: 40,
    color: "white",
    vx: 0,
    vy: 0,
    speed: 6,
    jumpPower: 14,
    onGround: true
};

// ===== PLAYER 2 =====
const player2 = {
    x: 900,
    y: groundY,
    width: 20,
    height: 40,
    color: "red",
    vx: 0,
    vy: 0,
    speed: 6,
    jumpPower: 14,
    onGround: true
};


// ===== INPUT =====
const keys = {};

window.addEventListener("keydown", (e) => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault();
    keys[e.code] = true;
});

window.addEventListener("keyup", (e) => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault();
    keys[e.code] = false;
});


// ===== UPDATE =====
function update() {

    // ----- PLAYER 1 (WASD) -----
    player.vx = 0;
    if (keys["KeyA"]) player.vx = -player.speed;
    else if (keys["KeyD"]) player.vx = player.speed;

    if (keys["KeyW"] && player.onGround) {
        player.vy = -player.jumpPower;
        player.onGround = false;
    }

    player.vy += gravity;
    player.x += player.vx;
    player.y += player.vy;

    if (player.y >= groundY) {
        player.y = groundY;
        player.vy = 0;
        player.onGround = true;
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;


    // ----- PLAYER 2 (Arrow Keys) -----
    player2.vx = 0;
    if (keys["ArrowLeft"]) player2.vx = -player2.speed;
    else if (keys["ArrowRight"]) player2.vx = player2.speed;

    if (keys["ArrowUp"] && player2.onGround) {
        player2.vy = -player2.jumpPower;
        player2.onGround = false;
    }

    player2.vy += gravity;
    player2.x += player2.vx;
    player2.y += player2.vy;

    if (player2.y >= groundY) {
        player2.y = groundY;
        player2.vy = 0;
        player2.onGround = true;
    }

    if (player2.x < 0) player2.x = 0;
    if (player2.x + player2.width > canvas.width) player2.x = canvas.width - player2.width;
}


// ===== DRAW =====
function draw() {
    // Background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = "#444";
    ctx.fillRect(0, groundY + player.height, canvas.width, 100);

    drawPlayer(player);
    drawPlayer(player2);
}


// ===== DRAW PLAYER =====
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


// ===== GAME LOOP =====
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
