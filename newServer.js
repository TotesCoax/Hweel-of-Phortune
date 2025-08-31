const {LocallyConnectedServer} = require('./classes/LocallyConnectedServer')

const NewGame = new LocallyConnectedServer('client')

// Socket IO Server Stuff
NewGame.io.on('connection', (player) => {
    console.log("It appears we have a visitor. Put on the tea.", player.id)
    player.on('disconnect', (reason) => {
        console.log(`${player.id} disconnected. Reason: ${reason}`)
    })
    player.on('speedData', (data) => {
        console.log(data)
        let spinPower = wheeltest.spinWheel(data)
        console.log(spinPower)
    })
})


// Serving the HTML Files
NewGame.app.get('/player', (req, res) => {
    res.sendFile(__dirname + '/client/playerScreen.html')
})

NewGame.app.get('/board', (req, res) => {
    res.sendFile(__dirname + '/client/mainScreen.html')
})

// Spin up the server
NewGame.server.listen(3000, () => {
    const addressInfo = NewGame.server.address()
    NewGame.generateQRCodeForServer(addressInfo.port, 'player')
})

// Board Stuff
const { Board } = require("./classes/Board")

let gameBoard = new Board("Message To Myself", "Congrats are in order")

gameBoard.board.forEach(row => console.table(row))
console.log(gameBoard)

// Player Stuff

const { Player } = require('./classes/Player')
const { v4: makeID } = require('uuid') //For Making Unique IDs

// Wheel Stuff

const { Wheel } = require('./classes/Wheel.js')

let wheeltest = new Wheel()

// wheeltest.generateSections(24, 2000)
// console.log(wheeltest)