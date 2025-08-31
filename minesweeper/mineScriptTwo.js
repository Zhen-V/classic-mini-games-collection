
// logic


export const tileStatuses = {
    hidden: 'hidden',
    mine: 'mine',
    number: 'number',
    marked: 'marked',
}


export function createBoard(boardSize, numberOfMines) {
    const board = []
    const minePosition = getMinePosition(boardSize, numberOfMines)

    
    for ( let x = 0; x < boardSize; x++) {
        const row = []
        for ( let y = 0; y < boardSize; y++) {
            const element = document.createElement("div")
            element.dataset.status = tileStatuses.hidden

            const tile = {
                element,
                x,
                y,
                mine: minePosition.some(positionMatch.bind(null, { x, y })),
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
    if (tile.status !== tileStatuses.hidden && 
        tile.status !== tileStatuses.marked
    ) {
        return
    }

    if (tile.status === tileStatuses.marked) {
        tile.status = tileStatuses.hidden
    } else {
        tile.status = tileStatuses.marked
    }
}

export function revealTile(board, tile) {
    if ( tile.status !== tileStatuses.hidden) {
        return
    }

    if(tile.mine) {
        tile.status = tileStatuses.mine
        return
    }

    tile.status = tileStatuses.number
    const adjasentTiles = nearbyTiles(board, tile)
    const mines = adjasentTiles.filter(t => t.mine)
    if (mines.length === 0) {
        adjasentTiles.forEach(revealTile.bind(null, board))
    } else {
        tile.element.textContent = mines.length
    }
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === tileStatuses.number || 
                (tile.mine && (tile.status === tileStatuses.hidden ||
                tile.status === tileStatuses.marked))
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === tileStatuses.mine
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
    return a.x === b.x && a.y === b.y  // Changed comma to logical AND (&&)
}

function randomNum(size) {
    return Math.floor(Math.random() * size)
}

function nearbyTiles(board, { x, y }) {
    const tiles = []  // Changed variable name to plural

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset]
            if (tile) tiles.push(tile)  // Push to tiles array
        }
    }

    return tiles
}