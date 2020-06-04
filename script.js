document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div')) //assigns all 200 divs into an array
    let  hiddenSquares = [squares[200],
                            squares[201],
                            squares[202],
                            squares[203],
                            squares[204],
                            squares[205],
                            squares[206],
                            squares[207],
                            squares[208],
                            squares[209]]
    const scoreDisplay = document.querySelector('#score') //selecting the id from the score span and button (below)
    const startBtn = document.querySelector('#start-button')
    const resetBtn = document.querySelector('#reset-button')
    resetBtn.disabled = true
    const width = 10 //width of the grid
    let nextRandom = 0
    let timerID
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]
    let speedinterval = 1000
    let isatLeftEdge //= current.some(index => (currentPosition + index) % width === 0)
    let isatRightEdge //= current.some(index => (currentPosition + index) % width === width-1)
 
//Defining the Tetrominoes
const lTetromino = [
     [1, width+1, width*2+1, 2],
     [width, width+1, width+2, width*2+2],
     [1, width+1, width*2, width*2+1],
     [0, width, width+1, width+2]
]

const zTretromino = [
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1]
]

const tTetrmonio = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
]

const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]

const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]

const theTetrominoes = [lTetromino,zTretromino,tTetrmonio,oTetromino,iTetromino]

let currentPosition = 4
let currentRotation = 0

//randomly select a tetromino
let random = Math.floor(Math.random()*theTetrominoes.length)
let current = theTetrominoes[random][currentRotation]

//draw the tetromino

function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
    resetBtn.disabled = true
}

//undraw the tetromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
    })
}

//make the tetromino move down every second
//timerId = setInterval(moveDown, 1000)

//assign functions to keyCodes
function control(e) {
    if(e.keyCode ===37) {
        moveLeft()
    } else if(e.keyCode ===38) {
        rotate()        
    } else if(e.keyCode === 39) {
        moveRight()
    } else if(e.keyCode === 40) {
        moveDown()
    }
}
//document.addEventListener('keyup', control)

//move down function
function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
}

//freeze function
function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random()* theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
}

//move the tetramino left unless it is at the edge or there is a blockage
function moveLeft() {
    undraw()
    isatLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isatLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
    {currentPosition +=1
    }
    draw()
}

//move the tetramino right unless it is at the edge or there is a blockage
    function moveRight() {
    undraw()
    isatRightEdge = current.some(index => (currentPosition + index) % width === width-1)
    if(!isatRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
    {currentPosition -=1
    }
    draw()
}

//rotate the tetromino
function rotate() {
    let savedRotation = currentRotation
    undraw()
    currentRotation ++
    if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
        currentRotation = 0
    }
    
    current = theTetrominoes[random][currentRotation]
    isatLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    isatRightEdge = current.some(index => (currentPosition + index) % width === width-1)
    
    if(isatLeftEdge && isatRightEdge) {
               currentRotation = savedRotation
    }

    current = theTetrominoes[random][currentRotation]
    draw()
}

//show up-next tetromino in mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0

//the tetrominos without rotation
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //itetromino
]

//display the shape in the mini-grid display
function displayShape() {
    //remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//add functionality to the start button
startBtn.addEventListener('click', startGame)

function startGame() {
    document.addEventListener('keyup', control)
    if(timerID) {
        clearInterval(timerID)
        timerID = null
        resetBtn.disabled = false
        document.removeEventListener('keyup', control)
    } else {
        draw() 
        timerID = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
        resetBtn.disabled = true
    }
}

//add functionality to the reset button
resetBtn.addEventListener('click', resetGame) 
   
function resetGame() {
    squares.forEach(square => {
        square.classList.remove('tetromino') //, 'taken')
        square.style.backgroundColor = ''
    })
    for(let i = 0; i<200; i++) {
        squares[i].classList.remove('taken')
    }
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
        document.removeEventListener('keyup', control)

    })
    
    
   // addTaken()
    random = nextRandom
    nextRandom = Math.floor(Math.random()* theTetrominoes.length)
    currentPosition = 4
    currentRotation = 0
    score = 0
    scoreDisplay.innerHTML = score;

    clearInterval(timerID)
}

/*//add Taken class back to hidden 10 divs
function addTaken() {
    for(let i=0; i<hiddenSquares.length; i++) {
        hiddenSquares[i].classList.add('taken')
    }
}*/

//add score
function addScore() {
    for (let i =0; i < 199; i+= width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
            // Increase the speed every 50 points
			if (score % 50 == 0 && speedinterval >= 200) {
                clearInterval(timerID);
                timerID = null
				speedinterval -= 200;
				timerID = setInterval(moveDown, speedinterval)
			}
        }
    }
}

//game over
function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'GAME OVER! Your final score was: ' + score
        clearInterval(timerID)
        resetBtn.disabled = false
    }
}
})
