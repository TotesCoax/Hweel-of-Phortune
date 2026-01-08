// npm install express socket.io qrcode


// Socket IO Stuff
import express from 'express'

import http from 'http'
import {Server} from 'socket.io'
// const http = require('http')
// const { Server } = require("socket.io")

//Utilities for Connection related stuff
// const DNS = require('dns')
// const OS = require('os')
import DNS from 'dns'
import OS from 'os'

// QRCode Stuff
// const QRCode = require('qrcode')
import QRCode from 'qrcode'

export class LocallyConnectedServer{
    /**
     * 
     * @param {string} path File path to public/static files folder.
     */
    constructor(path){
        this.path = path
        this.app = express()
        this.server = http.createServer(this.app)
        this.io = new Server(this.server)
        this.app.use(express.static(path))
    }
    /**
     * Generates a png of the local server address for the game.
     * @param {number} port Port the server is running on.
     * @param {string} routeToServer Route that the clients/players will use to connect via Socket.IO. Only needs to be a word, just make sure it's the same word you use when serving the static files. 
     * @param {string} pathToStaticFolder Path to the statis file folder. Defaults to the path supplied on creation, but I included it here in case it needed to be changed.
     */
    generateQRCodeForServer(port, routeToServer, pathToStaticFolder = this.path){
        DNS.lookup(OS.hostname(),{family: 4}, function(err, add, fam){
            console.log('The server is on.', `http://${add}:${port}/board`, `http://${add}:${port}/player`)
            QRCode.toFile(`./${pathToStaticFolder}/qrcode.png`, `http://${add}:${port}/${routeToServer}`, {type: 'png'}, function (err) {
                try {
                    if (err) throw err
                    console.log('QR Code Created', `./${pathToStaticFolder}/qrcode.png`)
                    return `./${pathToStaticFolder}/qrcode.png`                    
                } catch (error) {
                    console.log(error)
                }
            })
        })

    }
}

// This is some sample code to get a project off the ground
/*
const App = new LocallyConnectedServer('public')

// Socket IO Server Stuff
App.io.on('connection', (client) => {
    console.log("It appears we have a visitor. Put on the tea.", client.id)
    client.on('disconnect', (reason) => {
        console.log(`${client.id} disconnected. Reason: ${reason}`)
    })
})

// Serving the HTML Files
App.app.get('/index.js', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

// Spin up the server
App.server.listen(3000, () => {
    const addressInfo = App.server.address()
    App.generateQRCodeForServer(addressInfo.port)
})
*/
