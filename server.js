
// Socket IO Stuff
const express = require('express')
const app = express()

app.use(express.static('client'))

const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

// QRCode Stuff
const QRCode = require('qrcode')

QRCode.toFile(`${__dirname}/qrcode.png`, `http://192.168.0.116:3000/`, {
    type: 'png'
}, function (err) {
    if (err) throw err
    console.log('QR Code Created')
})

io.on("connection", (client) => {

    console.log("It appears we have a visitor. Put on the tea.", client.id)
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/scrollSpeed.html')
})

server.listen(3000, () => {
    const addressInfo = server.address()
    console.log('The server is on.', `http://${addressInfo.address}:${addressInfo.port}/`)
})