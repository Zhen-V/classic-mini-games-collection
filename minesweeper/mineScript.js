import { 
    tileStatuses, 
    createBoard, 
    markTile, 
    revealTile,
    checkWin,
    checkLose
} from './mineScriptTwo.js'

const boardBoxes = 10  
const numOfMines = 20  

let board = createBoard(boardBoxes, numOfMines)
const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.retro-text')
const restartBtn = document.querySelector(".restart-btn")

function initializeBoard() {
    boardElement.innerHTML = ''
    board = createBoard(boardBoxes, numOfMines)
    
    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element)
            tile.element.addEventListener('click', () => {
                revealTile(board, tile)
                checkGameEnd()
            })
            tile.element.addEventListener('contextmenu', e => {
                e.preventDefault()
                markTile(tile)
                listMinesLeft()
            })
        })
    })
    
    boardElement.style.setProperty("--size", boardBoxes)
    minesLeftText.textContent = numOfMines
    messageText.textContent = 'ОСТАЛОСЬ БОМБ:'
}


initializeBoard()

function listMinesLeft() {  
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === tileStatuses.MARKED).length 
    }, 0)

    minesLeftText.textContent = numOfMines - markedTilesCount
}

function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        boardElement.addEventListener('click', stopProp, { capture: true })
        boardElement.addEventListener('contextmenu', stopProp, { capture: true })
    }

    if (win) {
        messageText.textContent = 'ПОБЕДАААА'
    }
    if (lose) {
        messageText.textContent = 'ПРОИГРЫШ.'
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.mine) {
                    tile.status = tileStatuses.MINE 
                }
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
    e.preventDefault()
}

restartBtn.addEventListener('click', () => {
    initializeBoard() 
})
