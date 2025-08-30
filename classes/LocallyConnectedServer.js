
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
    constructor(){
        this.app = express()
        this.server = http.createServer(this.app)
        this.io = new Server(this.server)
        this.app.use(express.static('client'))
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

module.exports = { LocallyConnectedServer }