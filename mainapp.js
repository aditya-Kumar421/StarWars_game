const grid = document.querySelector('.grid')
const inst = document.querySelector('.start')
const resultDisplay = document.querySelector('.results')
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingright = true
let aliensRemoved = []
let results = 0
for (let i = 0; i < 225; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}
const squares = Array.from(document.querySelectorAll('.grid div'))
const alienInvdrs = [
    0, 2, 4, 6, 8,
    16, 18, 20, 22, 24,
    30, 32, 34, 36, 38,
    46, 48, 50, 52, 54
]

function draw() {
    for (let i = 0; i < alienInvdrs.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvdrs[i]].classList.add('invader')
        }
    }
}
draw()

function remove() {
    for (let i = 0; i < alienInvdrs.length; i++) {
        squares[alienInvdrs[i]].classList.remove('invader')
    }
}

squares[currentShooterIndex].classList.add('shooter')


function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width != 0) currentShooterIndex -= 1
            break;
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break;
    }
    squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)


function moveInvaders() {
    const leftedge = alienInvdrs[0] % width === 0
    const rightedge = alienInvdrs[alienInvdrs.length - 1] % width === width - 1
    remove()
    if (rightedge && goingright) {
        for (let i = 0; i < alienInvdrs.length; i++) {
            alienInvdrs[i] += width + 1
            direction = -1
            goingright = false
        }
    }

    if (leftedge && !goingright) {
        for (let i = 0; i < alienInvdrs.length; i++) {
            alienInvdrs[i] += width - 1
            direction = 1
            goingright = true
        }
    }
    for (let i = 0; i < alienInvdrs.length; i++) {
        alienInvdrs[i] += direction
    }
    draw()

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultDisplay.innerHTML = 'YOU LOST'
        clearInterval(invadersId)
    }
    for (let i = 0; i < alienInvdrs.length; i++) {
        if (alienInvdrs[i] >= squares.length) {
            resultDisplay.innerHTML = 'GAME OVER'
            clearInterval(invadersId)
        }
    }
    if (aliensRemoved.length === alienInvdrs.length) {
        resultDisplay.innerHTML = 'YOU WIN'
        clearInterval(invadersId)
    }

}

invadersId = setInterval(moveInvaders, 300)

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex
    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId)

            const alienRemoved = alienInvdrs.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            console.log(aliensRemoved)
            results++
            resultDisplay.innerHTML = results

        }
    }
    switch (e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser, 500)
        case ' ':
            laserId = setInterval(moveLaser, 500)
    }
}
document.addEventListener('keydown', shoot)