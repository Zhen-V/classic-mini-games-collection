
export const tileStatuses = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked',
}

export function createBoard(boardSize, numberOfMines) {
    const board = []
    const minePosition = getMinePosition(boardSize, numberOfMines)

    for (let x = 0; x < boardSize; x++) {
        const row = []
        for (let y = 0; y < boardSize; y++) {
            const element = document.createElement("div")
            element.dataset.status = tileStatuses.HIDDEN

            const tile = {
                element,
                x,
                y,
                mine: minePosition.some(pos => positionMatch(pos, { x, y })),
                get status() {
                    return this.element.dataset.status
                },
                set status(value) {
                    this.element.dataset.status = value
                },
            }

            row.push(tile)
        }
        board.push(row)
    }
    return board
}

export function markTile(tile) {
    if (tile.status !== tileStatuses.HIDDEN && 
        tile.status !== tileStatuses.MARKED) {
        return
    }

    if (tile.status === tileStatuses.MARKED) {
        tile.status = tileStatuses.HIDDEN
    } else {
        tile.status = tileStatuses.MARKED
    }
}

export function revealTile(board, tile) {
    if (tile.status !== tileStatuses.HIDDEN) {
        return
    }

    if (tile.mine) {
        tile.status = tileStatuses.MINE
        return
    }

    tile.status = tileStatuses.NUMBER
    const adjacentTiles = nearbyTiles(board, tile)  // Fixed spelling
    const mines = adjacentTiles.filter(t => t.mine)
    
    if (mines.length === 0) {
        adjacentTiles.forEach(t => {
            if (t.status === tileStatuses.HIDDEN) {
                revealTile(board, t)
            }
        })
    } else {
        tile.element.textContent = mines.length
    }
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === tileStatuses.NUMBER || 
                (tile.mine && (tile.status === tileStatuses.HIDDEN ||
                tile.status === tileStatuses.MARKED))
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === tileStatuses.MINE
        })
    })
}

function getMinePosition(boardSize, numberOfMines) {
    const positions = []

    while (positions.length < numberOfMines) {
        const position = {
            x: randomNum(boardSize),
            y: randomNum(boardSize)
        }

        if (!positions.some(p => positionMatch(p, position))) {
            positions.push(position)
        }
    }

    return positions
}

function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y
}

function randomNum(size) {
    return Math.floor(Math.random() * size)
}

function nearbyTiles(board, { x, y }) {
    const tiles = []

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            if (xOffset === 0 && yOffset === 0) continue 
            const tile = board[x + xOffset]?.[y + yOffset]
            if (tile) tiles.push(tile)
        }
    }

    return tiles
}

    return tiles

}
