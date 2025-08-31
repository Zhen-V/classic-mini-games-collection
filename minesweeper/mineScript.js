

//display

import { tileStatuses, 
    createBoard, 
    markTile, 
    revealTile,
    checkWin,
    checkLose
} from './mineScriptTwo.js'


const boardBoxes = 20
const numOfMines = 100


const board = (createBoard(boardBoxes, numOfMines))
const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.retro-text')
const restartBtn = document.querySelector(".restart-btn")


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
            lisyMinesLeft()
        })
    })
})


boardElement.style.setProperty("--size", boardBoxes)
minesLeftText.textContent = numOfMines

function lisyMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return ( 
            count + row.filter(tile => tile.status === tileStatuses.marked).length
    )
    }, 0)

    minesLeftText.textContent = numOfMines - markedTilesCount
}


function resetGame() {
    boardElement.innerHTML = ''
    firstClick = true
    revealedTiles = 0
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
         messageText.textContent = 'проигрыш.'
         board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === tileStatuses.marked) markTile(tile)
            if (tile.mine) revealTile(board, tile)})
         })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
    e.preventDefault()
}

restartBtn.addEventListener('click', restartForm)

function restartForm() {
    window.location.reload()
}
