const {LocallyConnectedServer} = require('./classes/LocallyConnectedServer')
const {v4: makeID} = require('uuid')

const GameServer = new LocallyConnectedServer('client')

// Socket IO Server Stuff
GameServer.io.on('connection', (player) => {
    console.log("It appears we have a visitor. Put on the tea.", player.id)
    player.on('playerJoin', (id, callback) =>{
        console.log('Player Join: ', id)
        if (!WOF.PlayerHandler.isPlayerExists()){
            console.log(`Creating new player.`)
            let newPlayerID = makeID()
            WOF.PlayerHandler.addPlayer(newPlayerID)
            console.table(WOF.PlayerHandler.players)
            callback(WOF.PlayerHandler.getPlayer(newPlayerID))
        } else {
            console.log(WOF.PlayerHandler.getPlayer(id))
            console.table(WOF.PlayerHandler.players)
            callback(WOF.PlayerHandler.getPlayer(id))
        }
        player.join('players')
        console.log(`Player joined room`)
    })
    player.on('boardJoin', (id, callback) =>{
        player.join('board')
        console.log(`Board joined board room`)
        callback('Room joined')
    })
    player.on('gamestateRequest', (id, callback) => {
        console.log(`Board request from: ${id}`)
        callback(WOF)
    })
    player.on('disconnect', (reason) => {
        player.leave('players')
        console.log(`${player.id} disconnected. Reason: ${reason}`)
    })
    player.on('speedData', (data) => {
        console.log(data)
        // if(WOF.PlayerHandler.isActivePlayer(data.id)){
            let spinPower = WOF.Wheel.spinWheel(data.value)
            console.log(spinPower)
            GameServer.io.to('board').emit('spinValue', spinPower)
        // }
    })
    player.on('nameChange', (data) => {
        console.log(data)
        let player = WOF.PlayerHandler.players[WOF.PlayerHandler.findPlayer(data.id)]
        player.setName(data.name)
        GameServer.io.to('board').emit('playerUpdate', WOF.PlayerHandler.players)
    })
    player.on('colorChange', (data) => {
        console.log(data)
        let player = WOF.PlayerHandler.players[WOF.PlayerHandler.findPlayer(data.id)]
        player.setColor(data.color)
        GameServer.io.to('board').emit('playerUpdate', WOF.PlayerHandler.players)
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
const { Player } = require('./classes/Player')

const WOF = new WOFGame()

WOF.Wheel.generateSections(1000)

WOF.Board.handleGuess('e')

// WOF.Board.board.forEach(row => {
//     console.table(row)
// })

// console.log(WOF)