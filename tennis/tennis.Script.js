
document.addEventListener('DOMContentLoaded', () => {
    const court = document.querySelector('.court');
    const ball = document.querySelector('.ball');
    const leftPaddle = document.querySelector('.left-paddle');
    const rightPaddle = document.querySelector('.right-paddle');
    const score1Element = document.getElementById('score1');
    const score2Element = document.getElementById('score2');
    const startButton = document.getElementById('start-button');
    
    let ballX = 50;
    let ballY = 50;
    let ballSpeedX = 5;
    let ballSpeedY = 5;
    let leftPaddleY = 150;
    let rightPaddleY = 150;
    let player1Score = 0;
    let player2Score = 0;
    let gameRunning = false;
    const PADDLE_HEIGHT = 100;
    const BALL_SIZE = 20;
    
    const keys = {
        w: false,
        s: false,
        ArrowUp: false,
        ArrowDown: false
    };
    
    function initGame() {
        ballX = court.clientWidth / 2 - BALL_SIZE / 2;
        ballY = court.clientHeight / 2 - BALL_SIZE / 2;
        leftPaddleY = court.clientHeight / 2 - PADDLE_HEIGHT / 2;
        rightPaddleY = court.clientHeight / 2 - PADDLE_HEIGHT / 2;
        
        ballSpeedX = Math.random() > 0.5 ? 5 : -5;
        ballSpeedY = Math.random() * 6 - 3;
        
        updatePositions();
    }
    
    function updatePositions() {
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;
        leftPaddle.style.top = `${leftPaddleY}px`;
        rightPaddle.style.top = `${rightPaddleY}px`;
    }
    
    function gameLoop() {
        if (!gameRunning) 
            return;
        
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        if (ballY <= 0 || ballY >= court.clientHeight - BALL_SIZE) {
            ballSpeedY = -ballSpeedY;
        }
        
        if (
            (ballX <= 30 + 15 && ballY + BALL_SIZE >= leftPaddleY && ballY <= leftPaddleY + PADDLE_HEIGHT) ||
            (ballX >= court.clientWidth - 45 && ballY + BALL_SIZE >= rightPaddleY && ballY <= rightPaddleY + PADDLE_HEIGHT)
        ) {
            ballSpeedX = -ballSpeedX * 1.1; 
            ballSpeedY += (Math.random() * 2 - 1) * 2; 
        }
        
        if (ballX < 0) {
            player2Score++;
            score2Element.textContent = player2Score.toString().padStart(2, '0');
            resetBall();
        } else if (ballX > court.clientWidth) {
            player1Score++;
            score1Element.textContent = player1Score.toString().padStart(2, '0');
            resetBall();
        }
        
        if (keys.w && leftPaddleY > 0) leftPaddleY -= 8;
        if (keys.s && leftPaddleY < court.clientHeight - PADDLE_HEIGHT) leftPaddleY += 8;
        if (keys.ArrowUp && rightPaddleY > 0) rightPaddleY -= 8;
        if (keys.ArrowDown && rightPaddleY < court.clientHeight - PADDLE_HEIGHT) rightPaddleY += 8;
        
        updatePositions();
        requestAnimationFrame(gameLoop);
    }
    
    function resetBall() {
        ballX = court.clientWidth / 2 - BALL_SIZE / 2;
        ballY = court.clientHeight / 2 - BALL_SIZE / 2;
        ballSpeedX = ballSpeedX > 0 ? -5 : 5;
        ballSpeedY = Math.random() * 6 - 3;
    }
    
    startButton.addEventListener('click', () => {
        if (!gameRunning) {
            gameRunning = true;
            player1Score = 0;
            player2Score = 0;
            score1Element.textContent = '00';
            score2Element.textContent = '00';
            startButton.textContent = 'ПАУЗА';
            initGame();
            gameLoop();
        } else {
            gameRunning = false;
            startButton.textContent = 'ПРОДОЛЖИТЬ';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            keys[e.key] = true;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            keys[e.key] = false;
        }
    });
    
    initGame();
});