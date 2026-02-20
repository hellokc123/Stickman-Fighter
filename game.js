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
    draw();
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
gameLoop();
