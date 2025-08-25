// console.log('File Loaded')

// const socket = io({transports: ['websocket', 'polling', 'flashsocket']})

// socket.on("connect", () => {
//     console.log(socket.id)
// })

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

renderBoard(generateBoard())