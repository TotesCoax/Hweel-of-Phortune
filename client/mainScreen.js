console.log('File Loaded')

import { EventCode } from "./classes/EventCode.js"

const socket = io({transports: ['websocket', 'polling', 'flashsocket']})


socket.on('connect', () => {
    console.log(`Socket Id: ${socket.id}`)
    socket.emit('boardJoin', socket.id, (res) => {
      console.log(`Data from server: ${res}`)
      socket.emit('gamestateRequest', socket.id, (res)=> {
        console.log(res)
        renderBoard(res.Board.board)
        renderClue(res.Board.clue)
        renderGuessedLetters(res.Board.guessedLetters)
        renderWheel(res.Wheel)
        renderPlayerTiles(res.PlayerHandler.players, res.PlayerHandler.turnIndicator)
        renderPlayerList(res.PlayerHandler.players)
      })
    })
})

socket.on('playerUpdate', gameStateRequest)


// socket.on('boardUpdate', boardUpdate)

// Board stuff


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
        element.lastChild.remove()
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
            if (col.isSpace){
                holder.classList.add('game-space')               
            }
            letter.innerText = col.character
            if (col.revealed){
                letter.classList.add('revealed')
            }
            letter.classList.add('processed')
            holder.append(letter)
            mainBoard.append(holder)
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
 * @property {boolean} isConnected
 */

/**
 * @param {Player[]} playersArray 
 */
function renderPlayerTiles(playersArray, turnIndex){
    let playerContainer = document.querySelector("#playerContainer")
    clearChildren(playerContainer)
    playersArray.forEach(player => {
        let playerTile = createPlayerTile(player)
        playerContainer.append(playerTile)
    })
    playerContainer.children[turnIndex].classList.add('active')
}

/**
 * 
 * @param {Player} playerData 
 * @returns 
 */
function createPlayerTile(playerData){
    let containerEl = document.createElement('div'),
        nameEl = document.createElement('p'),
        scoreEl = document.createElement('p')

        containerEl.classList.add('player-tile')
        nameEl.classList.add('player-name')
        scoreEl.classList.add('player-score')

        if (!playerData.isConnected){
            containerEl.classList.add('disconnected')
        }

        containerEl.style.backgroundColor = playerData.color
        nameEl.innerText = playerData.name
        scoreEl.innerText = playerData.score
        
        if (getBrightness(playerData.color) < 127){
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

function renderWheel(wheelObject){
    let sectionDivs = document.querySelectorAll('.wheel-text'),
        index = 0
    console.log(`Setting Section Values: ${wheelObject.sections}`)
    wheelObject.sections.forEach(section => {
        sectionDivs[index].innerText = section
        index++
    })
    spinWheel({start: 0, power: wheelObject.currentDeg, end: wheelObject.currentDeg, index: 0})
}
/**
 * 
 * @param {Player[]} playersArray 
 */
function renderPlayerList(playersArray){
    let selectGroup = document.getElementById('playerSelect'),
        blankOpt = document.createElement('option')
    clearChildren(selectGroup)
    selectGroup.append(blankOpt)
    playersArray.forEach(player => {
        let optionEl = document.createElement('option')
        optionEl.value = player.name
        optionEl.innerText = player.name
        selectGroup.append(optionEl)
    })
}


let wheelContainer = document.getElementById('wheelContainer')

/**
 * Resets the degree values to more manageable numbers for next calculation.
 */
function resetCurrentDeg(){
    console.log('Wheel Resetting to: ', getComputedStyle(document.documentElement).getPropertyValue('--ending-degree'))
    let newStarting = getComputedStyle(document.documentElement).getPropertyValue('--ending-degree')
    wheelContainer.style.transform = `rotate(${newStarting})`
    wheelContainer.classList.remove('spinning')
    console.log('Wheel Reset to: ', wheelContainer.style)
}

function setSpinAnim(start, power, end){
    document.documentElement.style.setProperty('--starting-degree', `${start}deg`)
    document.documentElement.style.setProperty('--spin-degree', `-${start+power}deg`)
    document.documentElement.style.setProperty('--ending-degree', `-${end}deg`)
}

function setFlashingSection(index){
    let wheelSections = document.querySelectorAll('.wheel-section'),
        currentSection = wheelSections[index]
    currentSection.addEventListener('animationend', () => {
        currentSection.classList.remove('flashing')
    }, {once: true})
    currentSection.classList.add('flashing')
}

socket.on('wheelSpin', spinWheel)

/**
 * @typedef {object} SpinData 
 * @prop {number} start
 * @prop {number} power
 * @prop {number} end
 * @prop {number} index
 */

/**
 * 
 * @param {SpinData} dataFromServer power value sent down from the server. 
 */
function spinWheel(dataFromServer){
    let offset = 82
    console.log(dataFromServer)
    setSpinAnim(dataFromServer.start, dataFromServer.power + offset, dataFromServer.end + offset)
    wheelContainer.addEventListener('animationend', () => {
        resetCurrentDeg()
        setFlashingSection(dataFromServer.index)
    }, {once: true})
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

// spinWheel(450)

//Game Actions

const guessForm = document.getElementById('guessForm')
const guessInput = document.getElementById('guessInput')

guessForm.addEventListener('submit', handleGuessSubmission)

/**
 * 
 * @param {SubmitEvent} e 
 */
function handleGuessSubmission(e){
    e.preventDefault()
    let letter = guessInput.value
    socket.emit(EventCode.letterSubmission, letter)
    guessInput.value = ''
}

//Admin Menus

// Refresh
const gamestateRefreshButton = document.getElementById('gamestateRefreshButton')
gamestateRefreshButton.addEventListener('click', gameStateRequest)
function gameStateRequest(){
        socket.emit('gamestateRequest', socket.id, (res)=> {
        console.log(res)
        renderBoard(res.Board.board)
        renderClue(res.Board.clue)
        renderGuessedLetters(res.Board.guessedLetters)
        renderWheel(res.Wheel)
        renderPlayerTiles(res.PlayerHandler.players, res.PlayerHandler.turnIndicator)
        renderPlayerList(res.PlayerHandler.players)
    })
}

// File Upload

// Player Menu

    // Add Player
    const addPlayerButton = document.getElementById('addPlayerButton')
    addPlayerButton.addEventListener('click', addPlayer)
    function addPlayer(){
        let playerName = document.getElementById('addPlayer').value
        socket.emit('manualAdd', playerName)
    }

    // Remove Player
    const removePlayerButton = document.getElementById('removePlayerButton')
    removePlayerButton.addEventListener('click', removePlayer)
    function removePlayer(){
        let playerName = document.querySelector('#playerSelect').value
        socket.emit('manualRemove', playerName)
    }