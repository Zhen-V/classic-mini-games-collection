let tileSize = 32;
let rows = 16;
let colums = 16;

let board;
let boardWidth = tileSize * colums;
let boardHeight = tileSize * rows; 
let context;

let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * colums/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
let shipVelocityX = 20;

let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let aliensColumn = 3;
let alienCount = 0;
let alienVelocityX = 1;

let bullerArray = [];
let bulletVelocityY = -10;

let score = 0;
let gameOver = false;
let gameStarted = false; // Added gameStarted flag
let scoreElement;
let animationId; // To store animation frame ID

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
    
    scoreElement = document.getElementById("score");

    shipImg = new Image();
    shipImg.src = "./ship.png";
    alienImg = new Image();
    alienImg.src = "./alien.png";


    setupControls();
}

function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    gameOver = false;
    score = 0;
    alienArray = [];
    bullerArray = [];
    
    ship.x = shipX;
    ship.y = shipY;
    
    createAliens();
    update();
    
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

function update() {
    animationId = requestAnimationFrame(update);
    scoreElement.textContent = score;

    if (gameOver) {
        cancelAnimationFrame(animationId);
        gameStarted = false;
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX*2;

                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            if (alien.y >= ship.y) {
                gameOver = true;
            }
        }
    }

    for (let i = 0; i < bullerArray.length; i++) {
        let bullet = bullerArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }

    while (bullerArray.length > 0 && (bullerArray[0].userd || bullerArray[0].y < 0)) {
        bullerArray.shift();
    }

    if (alienCount == 0) {
        aliensColumn = Math.min(aliensColumn + 1, colums/2 - 2);
        alienRows = Math.min(alienRows + 1, rows - 4);
        alienVelocityX += 0.2;
        alienArray = [];
        bullerArray = [];
        createAliens();
    }
}

function moveShip(e) {
    if (gameOver || !gameStarted) {
        return;
    }
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX;
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX;
    }
}

function createAliens() {
    for (let c = 0; c < aliensColumn; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img : alienImg,
                x : alienX + c * alienWidth,
                y : alienY + r * alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    if (gameOver || !gameStarted) {
        return;
    }
    if(e.code == "ArrowUp") {
        let bullet = {
            x : ship.x + shipWidth* 15/32,
            y : ship.y,
            width : tileSize/7,
            height : tileSize/2,
            userd : false
        }
        bullerArray.push(bullet);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function setupControls() {
    // Get control buttons
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    const startBtn = document.getElementById('start-button');

    // Set up start button
    startBtn.addEventListener('click', startGame);

    // Set up touch controls for mobile
    leftBtn.addEventListener('touchstart', () => {
        if (gameStarted && !gameOver) {
            ship.x = Math.max(0, ship.x - shipVelocityX);
        }
    });

    rightBtn.addEventListener('touchstart', () => {
        if (gameStarted && !gameOver) {
            ship.x = Math.min(board.width - ship.width, ship.x + shipVelocityX);
        }
    });

    rotateBtn.addEventListener('touchstart', () => {
        if (gameStarted && !gameOver) {
            let bullet = {
                x: ship.x + shipWidth * 15/32,
                y: ship.y,
                width: tileSize/7,
                height: tileSize/2,
                userd: false
            }
            bullerArray.push(bullet);
        }
    });

    // Key to button mapping
    const keyMap = {
        'ArrowLeft': leftBtn,
        'ArrowRight': rightBtn,
        'ArrowUp': rotateBtn,
        ' ': startBtn
    };

    // Add active class when key is pressed
    document.addEventListener('keydown', (e) => {
        const button = keyMap[e.key];
        if (button) {
            button.classList.add('active');
        }
    });

    // Remove active class when key is released
    document.addEventListener('keyup', (e) => {
        const button = keyMap[e.key];
        if (button) {
            button.classList.remove('active');
        }
    });
}