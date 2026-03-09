import { update as updateSnake, draw as drawSnake, snakeSpeed, getSnakeHead, snakeIntersection, resetSnake, getScore } from "./snake.js";
import { outsideGrid } from "./grid.js";
import { update as updateFood, draw as drawFood, resetFood } from './food.js';
import { resetInput } from './input.js';

const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const resetBtn = document.getElementById('resetBtn');

let lastRenderTime = 0;
let gameOver = false;
let isPaused = false;
let animationFrameId = null;
let gameStartTime = 0;

function initGameBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.setProperty('--grid-size', 21);
}

function main(currentTime) {
    if (gameOver) {
        handleGameOver();
        return;
    }
    
    if (isPaused) {
        animationFrameId = window.requestAnimationFrame(main);
        return;
    }
    
    animationFrameId = window.requestAnimationFrame(main);
    
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / snakeSpeed) return;

    lastRenderTime = currentTime;

    update();
    draw();
    updateScore();
}

function startGame() {
    gameOver = false;
    isPaused = false;  // Reset pause state
    gameStartTime = performance.now();
    
    if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
    }
    
    resetSnake();
    resetFood();
    resetInput(); 
    initGameBoard();
    
    lastRenderTime = performance.now(); 
    animationFrameId = window.requestAnimationFrame(main);
    
    resetBtn.textContent = 'ПАУЗА';
    resetBtn.onclick = togglePause;
}

function togglePause() {
    isPaused = !isPaused;
    resetBtn.textContent = isPaused ? 'ПРОДОЛЖИТЬ' : 'ПАУЗА';
    
    if (!isPaused && !gameOver) {
        lastRenderTime = performance.now();
        window.requestAnimationFrame(main);
    }
}

function handleGameOver() {
    const finalScore = getScore();
    if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    setTimeout(() => {
        if (confirm(`ИГРА ОКОНЧЕНА! Счёт: ${finalScore}\nИграем ещё?`)) {
            startGame();
        } else {
            resetBtn.textContent = 'ИГРАТЬ';
            resetBtn.onclick = startGame;
        }
    }, 100);
}

function update() {
    updateSnake();
    updateFood();
    checkDeath();
}

function draw() {
    gameBoard.innerHTML = '';
    drawSnake(gameBoard);
    drawFood(gameBoard);
}

function updateScore() {
    scoreDisplay.textContent = getScore();
}

function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
    return gameOver;
}

const keyDivs = {
    'ArrowLeft': document.getElementById('left-key'),
    'ArrowRight': document.getElementById('right-key'),
    'ArrowUp': document.getElementById('rotate-key'),
    'ArrowDown': document.getElementById('down-key'),
};

function handleKeyDown(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
    }
    
    if (keyDivs[event.key]) {
        keyDivs[event.key].classList.add('active');
    }
    
    if (event.code === 'Space' || event.key === ' ') {
        togglePause();
    }
}

function handleKeyUp(event) {
    if (keyDivs[event.key]) {
        keyDivs[event.key].classList.remove('active');
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
resetBtn.addEventListener('click', startGame);

window.startGame = startGame;
