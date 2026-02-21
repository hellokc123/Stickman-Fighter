const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 450;

ctx.imageSmoothingEnabled = false;

const player = {
    x: 200,
    y: 300,
    width: 20,
    height: 40,
    color: "white"
};

function update() {
    // movement later
}

function draw() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPlayer(player);
}

function drawPlayer(p) {
    ctx.fillStyle = p.color;

    ctx.fillRect(p.x, p.y, p.width, p.height); // body
    ctx.fillRect(p.x + 5, p.y - 15, 10, 10); // head
    ctx.fillRect(p.x - 5, p.y + 5, 5, 20); // left arm
    ctx.fillRect(p.x + p.width, p.y + 5, 5, 20); // right arm
    ctx.fillRect(p.x + 3, p.y + p.height, 5, 15); // left leg
    ctx.fillRect(p.x + 12, p.y + p.height, 5, 15); // right leg
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
