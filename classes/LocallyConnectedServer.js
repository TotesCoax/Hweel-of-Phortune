
// Socket IO Stuff
const express = require('express')

const http = require('http')
const { Server } = require("socket.io")

//Utilities for Connection related stuff
const DNS = require('dns')
const OS = require('os')

// QRCode Stuff
const QRCode = require('qrcode')

class LocallyConnectedServer{
    /**
     * 
     * @param {string} path File path to public/static files folder.
     */
    constructor(path){
        this.app = express()
        this.server = http.createServer(this.app)
        this.io = new Server(this.server)
        this.app.use(express.static(path))
    }
    generateQRCodeForServer(port){
        DNS.lookup(OS.hostname(),{family: 4}, function(err, add, fam){
            console.log('The server is on.', `http://${add}:${port}/`)
            QRCode.toFile(`${__dirname}/qrcode.png`, `http://${add}:${port}/player`, {type: 'png'}, function (err) {
                if (err) throw err
                console.log('QR Code Created')
            })
        })

    }
}

// This is some sample code to get a project off the ground
/*
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
    NewGame.generateQRCodeForServer(addressInfo.port)
})
*/
module.exports = { LocallyConnectedServer }