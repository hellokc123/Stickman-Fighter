// ===== CANVAS SETUP =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 450;

ctx.imageSmoothingEnabled = false;


// ===== GAME SETTINGS =====
const gravity = 0.6;
const groundLevel = 360;


// ===== PLAYER =====
const player = {
    x: 200,
    y: groundLevel,
    width: 20,
    height: 40,
    color: "white",

    velocityX: 0,
    velocityY: 0,

    speed: 4,
    jumpPower: 12,

    onGround: true
};


// ===== INPUT =====
const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});


// ===== UPDATE =====
function update() {

    // Horizontal movement
    if (keys["a"]) {
        player.velocityX = -player.speed;
    } else if (keys["d"]) {
        player.velocityX = player.speed;
    } else {
        player.velocityX = 0;
    }

    // Jump
    if (keys["w"] && player.onGround) {
        player.velocityY = -player.jumpPower;
        player.onGround = false;
    }

    // Apply gravity
    player.velocityY += gravity;

    // Apply movement
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Ground collision
    if (player.y >= groundLevel) {
        player.y = groundLevel;
        player.velocityY = 0;
        player.onGround = true;
    }

    // Keep inside screen
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width)
        player.x = canvas.width - player.width;
}


// ===== DRAW =====
function draw() {

    // Background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = "#444";
    ctx.fillRect(0, groundLevel + player.height, canvas.width, 100);

    drawPlayer(player);
}


// ===== DRAW PLAYER =====
function drawPlayer(p) {

    ctx.fillStyle = p.color;

    // Body
    ctx.fillRect(p.x, p.y, p.width, p.height);

    // Head
    ctx.fillRect(p.x + 5, p.y - 15, 10, 10);

    // Left arm
    ctx.fillRect(p.x - 5, p.y + 5, 5, 20);

    // Right arm
    ctx.fillRect(p.x + p.width, p.y + 5, 5, 20);

    // Left leg
    ctx.fillRect(p.x + 3, p.y + p.height, 5, 15);

    // Right leg
    ctx.fillRect(p.x + 12, p.y + p.height, 5, 15);
}


// ===== GAME LOOP =====
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
