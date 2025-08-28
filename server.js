
// Socket IO Stuff
const express = require('express')
const app = express()

app.use(express.static('client'))

const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

//Utilities for Connection related stuff
const DNS = require('dns')
const OS = require('os')

// QRCode Stuff
const QRCode = require('qrcode')

function generateQRCodeForServer(port){
    DNS.lookup(OS.hostname(),{family: 4}, function(err, add, fam){
        console.log('The server is on.', `http://${add}:${port}/`)
        QRCode.toFile(`${__dirname}/qrcode.png`, `http://${add}:${port}/player`, {type: 'png'}, function (err) {
            if (err) throw err
            console.log('QR Code Created')
        })
    })

}

// Socket IO Server Stuff
io.on('connection', (player) => {
    console.log("It appears we have a visitor. Put on the tea.", player.id)
    player.on('disconnect', (reason) => {
        console.log(`${player.id} disconnected. Reason: ${reason}`)
    })
    player.on('speedData', (data) => {
        console.log(data)
    })
})


// Serving the HTML Files
app.get('/player', (req, res) => {
    res.sendFile(__dirname + '/client/playerScreen.html')
})

app.get('/board', (req, res) => {
    res.sendFile(__dirname + '/client/mainScreen.html')
})


server.listen(3000, () => {
    const addressInfo = server.address()
    generateQRCodeForServer(addressInfo.port)
})

// Board Stuff
const { Board } = require("./classes/Board")

// let gameBoard = new Board("Congrats are in order")

// gameBoard.handleGuess('O')

// gameBoard.board.forEach(row => console.table(row))

// Player Stuff

const { Player } = require('./classes/Player')
const { v4: makeID } = require('uuid') //For Making Unique IDs

// Wheel Stuff

const { Wheel } = require('./classes/Wheel.js')

let wheeltest = new Wheel()

wheeltest.generateSections(24, 2000)
console.log(wheeltest)

let holder = []

for (let index = 0; index < 10000; index++) {
    holder.push(wheeltest.spinWheel(25))
}