const {LocallyConnectedServer} = require('./classes/LocallyConnectedServer')
const {v4: makeID} = require('uuid')

const GameServer = new LocallyConnectedServer('client')

// Socket IO Server Stuff
GameServer.io.on('connection', (player) => {
    console.log("It appears we have a visitor. Put on the tea.", player.id)
    player.on('playerJoin', (id, callback) =>{
        if (id){
            console.log(WOF.PlayerHandler.findPlayer(id))
        }
        player.join('players')
        console.log(`Player joined room`)
        callback('Room joined')
    })
    player.on('boardJoin', (id, callback) =>{
        player.join('board')
        console.log(`Board joined board room`)
        callback('Room joined')
    })
    player.on('disconnect', (reason) => {
        player.leave('players')
        console.log(`${player.id} disconnected. Reason: ${reason}`)
    })
    player.on('speedData', (data) => {
        console.log(data)
        let spinPower = WOF.Wheel.spinWheel(data)
        console.log(spinPower)
    })
    player.on('nameChange', (data) => {
        console.log(data)
    })
    player.on('colorChange', (data) => {
        console.log(data)
    })
})


// Serving the HTML Files
GameServer.app.get('/player', (req, res) => {
    res.sendFile(__dirname + '/client/playerScreen.html')
})

GameServer.app.get('/board', (req, res) => {
    res.sendFile(__dirname + '/client/mainScreen.html')
})

// Spin up the server
GameServer.server.listen(3000, () => {
    const addressInfo = GameServer.server.address()
    GameServer.generateQRCodeForServer(addressInfo.port, 'player')
})

const {WOFGame} = require('./classes/WOFGame')

const WOF = new WOFGame()

console.log(WOF)