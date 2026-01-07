console.log('File Loaded')

import { EventCode } from "./classes/EventCode.js"

console.log(EventCode)

const socket = io({transports: ['websocket', 'polling', 'flashsocket']})


socket.on('connect', () => {
    console.log(`Socket Id: ${socket.id}`)
    socket.emit('boardJoin', socket.id, (res) => {
      console.log(`Data from server: ${res}`)
      if (gamestate){
        return
      }
      socket.emit('gamestateRequest', socket.id, (res)=> {
        console.log(res)
        gamestate = true
        renderBoard(res.Board.board)
        renderClue(res.Board.clue)
        renderGuessedLetters(res.Board.guessedLetters)
        renderWheel(res.Wheel.sections)
        renderScores(res.Players)
      })
    })
})

socket.on('playerUpdate', (data) => {
    // Eventually re-render player board
    console.log(`Data from Server: ${data}`)
})

// socket.on('boardUpdate', boardUpdate)

// Board stuff

let gamestate = false

function generateTestBoard(){
    let board = [new Array(12).fill("1"), new Array(12).fill("2"), new Array(12).fill("3"), new Array(12).fill("4")]
    return board
}

/**
 * 
 * @param {HTMLElement} element 
 */
function clearChildren(element){
    while (element.firstChild){
        element.remove(element.lastChild)
    }
}

/**
 * @typedef {object} Letter
 * @property {string} character
 * @property {boolean} revealed
 * @property {boolean} isVowel
 * @property {boolean} isLetter
 * @property {boolean} isPunc
 * @property {boolean} isSpace
*/

/**
 * 
 * @param {Letter[][]} arrayByLetter 
 */
function renderBoard(arrayByLetter){
    let mainBoard = document.querySelector("#mainBoard")
    clearChildren(mainBoard)
    for (const row of arrayByLetter) {
        for (const col of row) {
            let letter = document.createElement("p"),
                holder = document.createElement('div')
            letter.innerText = col.character
            switch (true) {
                case col.revealed:
                    letter.classList.add('revealed')
                case col.isSpace:
                    letter.classList.add('game-space')
                default:
                    letter.classList.add('processed')
                    break;
            }
            holder.append(letter)
            mainBoard.append(letter)
        }
    }
}

/**
 * 
 * @param {string} clue 
 */
function renderClue(clue){
    let clueContainer = document.querySelector('#clueContainer'),
        newP = document.createElement('p')
    clearChildren(clueContainer)
    newP.classList.add('clueContent')
    newP.innerText = clue
    clueContainer.append(newP)
}

/**
 * @param {string} arrayOfChar - array of guessed letters
 */
function renderGuessedLetters(arrayOfChar){
    let usedLettersContainer = document.getElementById('usedLettersContainer')
    clearChildren(usedLettersContainer)
    arrayOfChar.forEach(letter => {
        let p = document.createElement('p')
        p.innerText = letter
        usedLettersContainer.append(p)
    })
}

/**
 * @typedef {object} Player
 * @property {string} gameID
 * @property {string} name
 * @property {number} score
 * @property {string} color
 */

/**
 * @param {Player[]} playersArray 
 */
function renderScores(playersArray){
    let playerContainer = document.querySelector("#playerContainer")
    clearChildren(playerContainer)
    playersArray.forEach(player => {
        let playerTile = createPlayerTile(player.name, player.score, player.color)
        playerContainer.append(playerTile)
    })
}

function createPlayerTile(playerName, playerScore, playerColor){
    let containerEl = document.createElement('div'),
        nameEl = document.createElement('p'),
        scoreEl = document.createElement('p')

        containerEl.classList.add('player-tile')
        nameEl.classList.add('player-name')
        scoreEl.classList.add('player-score')

        containerEl.style.backgroundColor = playerColor
        nameEl.innerText = playerName
        scoreEl.innerText = playerScore
        
        if (getBrightness(playerColor) < 127){
            nameEl.style.color = "white"
            scoreEl.style.color = "white"
        }

        containerEl.append(nameEl, scoreEl)

        return containerEl
}

// Wheel Stuff

/**
 * This will arrange all the 24 wheel sections around a central point
 */
function arrangeWheelSections(){
    let sections = document.querySelectorAll('.wheel-section'),
        degreeIncrement = 0
    
    sections.forEach(section => {
        // console.log(section, degreeIncrement)
        section.style.transform = `rotate(${degreeIncrement}deg)`
        degreeIncrement += 15
    })
}
arrangeWheelSections()

function renderWheel(wheelSections){
    let sectionDivs = document.querySelectorAll('.wheel-text'),
        index = 0
    console.log(`Setting Section Values: ${wheelSections}`)
    wheelSections.forEach(section => {
        sectionDivs[index].innerText = section
        index++
    })
}


let wheelContainer = document.getElementById('wheelContainer')

// when animation ends, trigger a value reset
wheelContainer.addEventListener('animationend', resetCurrentDeg)

/**
 * Resets the degree values to more manageable numbers for next calculation.
 */
function resetCurrentDeg(){
    console.log('Wheel Resetting to: ', getComputedStyle(document.documentElement).getPropertyValue('--ending-degree'))
    let newVal = getComputedStyle(document.documentElement).getPropertyValue('--ending-degree')
    wheelContainer.style.transform = `rotate(${newVal})`
    wheelContainer.classList.remove('spinning')
    console.log('Wheel Reset to: ', wheelContainer.style)
}

function setSpinAnim(start, end){
    document.documentElement.style.setProperty('--starting-degree', start)
    document.documentElement.style.setProperty('--ending-degree', end)
}

/**
 * 
 * @param {string} power power value sent down from the server. 
 */
function spinWheel(power){
    let start = wheelContainer.style.transform
    setSpinAnim(start, `${power}deg`)
    wheelContainer.classList.add('spinning')
}

// Player board stuff

/**
 * 
 * @param {string} hex 
 * @returns {number} If greater than X
 */
function getBrightness(hex){
    let rgb = hexToRGB(hex)

    return 0.2126 * rgb.red + 0.7152 * rgb.green + 0.0722 * rgb.blue
}

function hexToRGB(h) {
  let r = 0, g = 0, b = 0;

  // 3 digits
  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

  // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }
//   The + somehow magically makes it a number
  return {'red': +r, 'green': +g, 'blue': +b}
}

spinWheel(450)