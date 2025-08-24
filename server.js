
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

function getServerIP(){
    let ipv4
    

    console.log(ipv4)
}

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
io.on('connection', (client) => {
    console.log("It appears we have a visitor. Put on the tea.", client.id)
    client.on('disconnect', (reason) => {
        console.log(`${client.id} disconnected. Reason: ${reason}`)
    })
})


// Serving the HTML Files
app.get('/player', (req, res) => {
    res.sendFile(__dirname + '/client/scrollSpeed.html')
})

server.listen(3000, () => {
    const addressInfo = server.address()
    generateQRCodeForServer(addressInfo.port)
})