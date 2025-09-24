console.log('File Loaded')

const socket = io({transports: ['websocket', 'polling', 'flashsocket']})

socket.on('connect', () => {
    console.log(socket.id)
    socket.emit('boardJoin', socket.id, (res) => {
      console.log(res)
    })
})

socket.on('playerUpdate', (data) => {
    // Eventually re-render player board
    console.log(data)
})

// socket.on('boardUpdate', boardUpdate)

// Board stuff

function generateBoard(){
    let board = [new Array(12).fill("1"), new Array(12).fill("2"), new Array(12).fill("3"), new Array(12).fill("4")]
    return board
}

console.log(generateBoard())

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
            letter.innerText = col
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

// Wheel Stuff

let sections = document.querySelectorAll('.wheel-section'),
    degreeIncrement = 0

sections.forEach(section => {
    console.log(section, degreeIncrement)
    section.style.transform = `rotate(${degreeIncrement}deg)`
    degreeIncrement += 15
})

let wheelContainer = document.getElementById('wheelContainer')

wheelContainer.addEventListener('animationend', resetCurrentDeg)

function resetCurrentDeg(){
    console.log('Wheel Resetting', getComputedStyle(document.documentElement).getPropertyValue('--ending-degree'))
    let newVal = getComputedStyle(document.documentElement).getPropertyValue('--ending-degree')
    wheelContainer.style.transform = `rotate(${newVal})`
    wheelContainer.classList.remove('spinning')
    console.log('Wheel Reset', wheelContainer.style)
}

function setSpinAnim(start, end){
    document.documentElement.style.setProperty('--starting-degree', start)
    document.documentElement.style.setProperty('--ending-degree', end)
}

function spinWheel(power){
    let start = wheelContainer.style.transform
    setSpinAnim(start, `${power}deg`)
    wheelContainer.classList.add('spinning')
}

// Player board stuff

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

console.log(hexToRGB('#fff'))
console.log(getBrightness('#fff'))

spinWheel(450)

renderBoard('Kreeps and Margaritas')
renderClue('A lovely night')