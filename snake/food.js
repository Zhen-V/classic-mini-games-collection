import { onSnake, expandSnake } from './snake.js';
import { randomGridPosition } from './grid.js';

let food = getRandomFood();
const expansionRate = 1;

export function update() {
    if (onSnake(food)) {
        expandSnake(expansionRate);
        food = getRandomFood();
    }
}

export function draw(gameBoard) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

export function resetFood() {
    food = getRandomFood();
}

function getRandomFood() {
    let newFood;
    while (newFood == null || onSnake(newFood)) {
        newFood = randomGridPosition();
    }
    return newFood;
}