const CELL_SIZE = 20;

const DIRECTIONS = {
    ArrowLeft: {
        code: 37,
        row: 0,
        col: -1,
        rotation: 180
    },
    ArrowUp: {
        code: 38,
        row: -1,
        col: 0,
        rotation: 270
    },
    ArrowRight: {
        code: 39,
        row: 0,
        col: 1,
        rotation: 0
    },
    ArrowDown: {
        code: 40,
        row: 1,
        col: 0,
        rotation: 90
    }
};

const OBJECT_TYPE = {
    BLANK: 'blank',
    WALL: 'wall',
    DOT: 'dot',
    BLINKY: 'blinky',
    PINKY: 'pinky',
    INKY: 'inky',
    CLYDE: 'clyde',
    PILL: 'pill',
    PACMAN: 'pacman',
    GHOST: 'ghost',
    SCARED: 'scared',
    GHOSTLAIR: 'lair'
};

const CLASS_LIST = [
    OBJECT_TYPE.BLANK,
    OBJECT_TYPE.WALL,
    OBJECT_TYPE.DOT,
    OBJECT_TYPE.BLINKY,
    OBJECT_TYPE.PINKY,
    OBJECT_TYPE.INKY,
    OBJECT_TYPE.CLYDE,
    OBJECT_TYPE.PILL,
    OBJECT_TYPE.PACMAN,
    OBJECT_TYPE.GHOSTLAIR
];

const LEVEL = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1,
    1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1,
    0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0,
    0, 0, 0, 1, 2, 1, 2, 1, 9, 9, 9, 9, 1, 2, 1, 2, 1, 0, 0, 0,
    1, 1, 1, 1, 2, 1, 2, 1, 9, 9, 9, 9, 1, 2, 1, 2, 1, 1, 1, 1,
    1, 0, 0, 0, 2, 2, 2, 1, 9, 9, 9, 9, 1, 2, 2, 2, 0, 0, 0, 1,
    1, 1, 1, 1, 2, 1, 2, 1, 9, 9, 9, 9, 1, 2, 1, 2, 1, 1, 1, 1,
    0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0,
    0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0,
    1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1,
    1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1,
    1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];


//functions helper
const _ = (sel) => document.querySelector(sel)
const __ = (sel) => document.querySelectorAll(sel)
const getElData = (row, col) => _(`div[data-row='${row}'][data-col='${col}']`)
const checkCell = (row, col, name) => getElData(row, col).classList.contains(name)
const rand = (l, h) => ~~(l + Math.random() * (h - l))


//variables
const gameBoard = _("#game");
const gameScore = _("#score");
const btnStart = _("#start-button");
const speed = 200;
const timePill = 10000;
const diley = 2000;
let next_move = DIRECTIONS.ArrowRight;
let score = 0;
let isPill = false;
let ghosts = [
    {
        class_: OBJECT_TYPE.BLINKY,
        row: rand(10, 11),
        col: rand(9, 13),
        move: DIRECTIONS[Object.keys(DIRECTIONS)[rand(0, 4)]]
    },
    {
        class_: OBJECT_TYPE.PINKY,
        row: rand(10, 11),
        col: rand(9, 13),
        move: DIRECTIONS[Object.keys(DIRECTIONS)[rand(0, 4)]]
    },
    {
        class_: OBJECT_TYPE.INKY,
        row: rand(10, 11),
        col: rand(9, 13),
        move: DIRECTIONS[Object.keys(DIRECTIONS)[rand(0, 4)]]
    },
    {
        class_: OBJECT_TYPE.CLYDE,
        row: rand(10, 11),
        col: rand(9, 13),
        move: DIRECTIONS[Object.keys(DIRECTIONS)[rand(0, 4)]]
    }
]
let timer;

//main function
function createBoard() {
    gameBoard.innerHTML = ''
    let i = 0;
    for (let row = 1; row <= 23; row++) {
        for (let col = 1; col <= 20; col++) {
            const div = document.createElement("div");
            div.classList.add(CLASS_LIST[LEVEL[i++]]);

            if (row == 15 && col == 8) {
                div.classList.add(OBJECT_TYPE.PACMAN);
            }

            if (row == ghosts[0].row && col == ghosts[0].col) {
                div.classList.add(ghosts[0].class_)
                div.classList.add(OBJECT_TYPE.GHOST)
            }
            if (row == ghosts[1].row && col == ghosts[1].col) {
                div.classList.add(ghosts[1].class_)
                div.classList.add(OBJECT_TYPE.GHOST)
            }
            if (row == ghosts[2].row && col == ghosts[2].col) {
                div.classList.add(ghosts[2].class_)
                div.classList.add(OBJECT_TYPE.GHOST)
            }
            if (row == ghosts[3].row && col == ghosts[3].col) {
                div.classList.add(ghosts[3].class_)
                div.classList.add(OBJECT_TYPE.GHOST)
            }

            div.setAttribute("data-col", col)
            div.setAttribute("data-row", row)
            div.style.cssText = `width:${CELL_SIZE}px;height:${CELL_SIZE}px`
            gameBoard.appendChild(div)
        }
    }
}

function movePacman() {
    const row = Number(_(`.${OBJECT_TYPE.PACMAN}`).getAttribute("data-row"));
    const col = Number(_(`.${OBJECT_TYPE.PACMAN}`).getAttribute("data-col"));
    const row_ = row + next_move.row;
    const col_ = col + next_move.col;


    if (
        !checkCell(row_, col_, OBJECT_TYPE.WALL) &&
        !checkCell(row_, col_, OBJECT_TYPE.GHOSTLAIR)
    ) {
        getElData(row, col).style.transform = `rotate(0)`
        getElData(row_, col_).style.transform = `rotate(${next_move.rotation}deg)`
        getElData(row_, col_).classList.add(OBJECT_TYPE.PACMAN)
        getElData(row, col).classList.remove(OBJECT_TYPE.PACMAN)
        if (checkCell(row_, col_, OBJECT_TYPE.DOT)) {
            getElData(row_, col_).classList.remove(OBJECT_TYPE.DOT)
            getElData(row_, col_).classList.add(OBJECT_TYPE.BLANK)
            score += 10;
            if (!_(`.${OBJECT_TYPE.DOT}`)) endGame(true)
        }
        if (checkCell(row_, col_, OBJECT_TYPE.PILL) && !isPill) {
            getElData(row_, col_).classList.remove(OBJECT_TYPE.PILL)
            getElData(row_, col_).classList.add(OBJECT_TYPE.BLANK)
            score += 50;
            isPill = true
            setTimeout(() => {
                isPill = false
                __(`.${OBJECT_TYPE.SCARED}`).forEach(el => {
                    el.classList.remove(OBJECT_TYPE.SCARED)
                })
            }, timePill);
        }
    }
}

function moveGhost() {

    ghosts.forEach(ghost => {
        const { row, col, class_, move } = ghost;
        const row_ = row + move.row, col_ = col + move.col;

        if (
            !checkCell(row_, col_, OBJECT_TYPE.WALL) &&
            !checkCell(row_, col_, OBJECT_TYPE.GHOSTLAIR)
        ) {
            getElData(row_, col_).classList.add(class_)
            getElData(row_, col_).classList.add(OBJECT_TYPE.GHOST)
            getElData(row, col).classList.remove(class_)
            getElData(row, col).classList.remove(OBJECT_TYPE.GHOST)
            if (isPill) {
                getElData(row, col).classList.remove(OBJECT_TYPE.SCARED)
                getElData(row_, col_).classList.add(OBJECT_TYPE.SCARED)
            }
            ghost.row = row_
            ghost.col = col_

            let options_move = []
            Object.keys(DIRECTIONS).forEach(arrow => {
                if (
                    !checkCell(ghost.row + DIRECTIONS[arrow].row, ghost.col + DIRECTIONS[arrow].col, OBJECT_TYPE.WALL) &&
                    !checkCell(ghost.row + DIRECTIONS[arrow].row, ghost.col + DIRECTIONS[arrow].col, OBJECT_TYPE.GHOSTLAIR)
                ) options_move.push(arrow)
            })
            ghost.move = rand(0, 10) > 4 ? ghost.move : DIRECTIONS[options_move[rand(0, options_move.length)]]
        } else {
            ghost.move = DIRECTIONS[Object.keys(DIRECTIONS)[rand(0, 4)]]
        }
    })
}

function setScore() {
    gameScore.innerHTML = score;
}

function checkEat() {
    if (_(`.${OBJECT_TYPE.PACMAN}`)) {
        const row = Number(_(`.${OBJECT_TYPE.PACMAN}`).getAttribute("data-row"))
        const col = Number(_(`.${OBJECT_TYPE.PACMAN}`).getAttribute("data-col"))
        const g = ghosts.find(ghost => ghost.row == row && ghost.col == col)

        if (g) {
            if (isPill) {
                _(`.${g.class_}`).classList.remove(OBJECT_TYPE.GHOST)
                _(`.${g.class_}`).classList.remove(g.class_)
                score += 500;
                ghosts.splice(ghosts.findIndex(ghost => ghost.class_ == g.class_), 1)
                if (ghosts.length == 0) endGame(true)
            } else {
                endGame(false)
            }
        }
    }
}

function endGame(win) {
    clearTimeout(timer);
    if (win) {
        gameScore.innerHTML = `YOU WIN!!! : ${score}`;
    }
    else {
        _(`.${OBJECT_TYPE.PACMAN}`).style.transform = `rotate(0)`
        _(`.${OBJECT_TYPE.PACMAN}`).classList.remove(OBJECT_TYPE.PACMAN)
        gameScore.innerHTML = `GAME OVER!!! : ${score}`;
    }
    btnStart.classList.remove("hide")
}

function startGame() {
    gameBoard.classList.remove("hide")
    score = 0;
    next_move = DIRECTIONS.ArrowRight;
    isPill = false;
    ghosts = [
        {
            class_: OBJECT_TYPE.BLINKY,
            row: rand(10, 11),
            col: rand(9, 13),
            move: DIRECTIONS[Object.keys(DIRECTIONS)[rand(0, 4)]]
        },
        {
            class_: OBJECT_TYPE.PINKY,
            row: rand(10, 11),
            col: rand(9, 13),
            move: DIRECTIONS[Object.keys(DIRECTIONS)[rand(0, 4)]]
        },
        {
            class_: OBJECT_TYPE.INKY,
            row: rand(10, 11),
            col: rand(9, 13),
            move: DIRECTIONS[Object.keys(DIRECTIONS)[rand(0, 4)]]
        },
        {
            class_: OBJECT_TYPE.CLYDE,
            row: rand(10, 11),
            col: rand(9, 13),
            move: DIRECTIONS[Object.keys(DIRECTIONS)[rand(0, 4)]]
        }
    ]
    createBoard()
    setTimeout(() => {
        timer = setInterval(() => {
            movePacman()
            checkEat()
            setScore()
            moveGhost()
            checkEat()
        }, speed)
    }, diley);
}

btnStart.onclick = () => {
    startGame();
    btnStart.classList.add("hide")
}


document.body.onkeydown = (e) => {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
        if (
            _(`.${OBJECT_TYPE.PACMAN}`)
            &&
            !checkCell(Number(_(`.${OBJECT_TYPE.PACMAN}`).getAttribute("data-row")) + DIRECTIONS[e.key].row, Number(_(`.${OBJECT_TYPE.PACMAN}`).getAttribute("data-col")) + DIRECTIONS[e.key].col, OBJECT_TYPE.WALL) &&
            !checkCell(Number(_(`.${OBJECT_TYPE.PACMAN}`).getAttribute("data-row")) + DIRECTIONS[e.key].row, Number(_(`.${OBJECT_TYPE.PACMAN}`).getAttribute("data-col")) + DIRECTIONS[e.key].col, OBJECT_TYPE.GHOSTLAIR)
        )
            next_move = DIRECTIONS[e.key]
    }
}