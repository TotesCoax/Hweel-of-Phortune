import WheelSpinner from "./classes/WheelSpinner.js"

console.log('File Loaded')

const socket = io({transports: ['websocket', 'polling', 'flashsocket']})

socket.on("connect", () => {
    console.log(socket.id)
})

function generateBoard(){
    let board = [new Array(12).fill("1"), new Array(12).fill("2"), new Array(12).fill("3"), new Array(12).fill("4")]
    return board
}

console.log(generateBoard())

function renderBoard(arrayByLetter){
    let mainBoard = document.querySelector("#mainBoard")

    for (const row of arrayByLetter) {
        for (const col of row) {
            let letter = document.createElement("p")
            letter.innerText = col
            mainBoard.append(letter)
        }
    }

}


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