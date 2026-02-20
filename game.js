const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Set resolution (internal pixel resolution)
canvas.width = 800;
canvas.height = 450;

// Disable smoothing (important for pixel style)
ctx.imageSmoothingEnabled = false;

// Game loop
function gameLoop() {
    update();
    function draw() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPlayer(player);
}

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
    requestAnimationFrame(gameLoop);
}

function update() {
    // We'll put movement + physics here later
}

function draw() {
    // Clear screen
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Start game
const player = {
    x: 200,
    y: 300,
    width: 20,
    height: 40,
    color: "white"
};

gameLoop();
