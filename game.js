// ===== CANVAS SETUP =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

// ===== GAME SETTINGS =====
const gravity = 0.6;

// ===== PLAYER 1 =====
const player1 = {
    x: 200,
    y: 0, // we will set ground dynamically
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
    y: 0,
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

// ===== RESIZE CANVAS =====
let groundY;
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    groundY = canvas.height - 100; // 100px ground height
    // reset players if below ground
    if (player1.y > groundY) player1.y = groundY;
    if (player2.y > groundY) player2.y = groundY;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // initial setup

// ===== UPDATE FUNCTION =====
function updatePlayer(p, leftKey, rightKey, jumpKey) {
    // Horizontal movement
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

    // Screen bounds
    if (p.x < 0) p.x = 0;
    if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;
}

function update() {
    updatePlayer(player1, "KeyA", "KeyD", "KeyW"); // WASD
    updatePlayer(player2, "ArrowLeft", "ArrowRight", "ArrowUp"); // Arrow Keys
}

// ===== DRAW FUNCTIONS =====
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
}

// ===== GAME LOOP =====
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
