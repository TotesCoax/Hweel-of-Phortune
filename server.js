const {LocallyConnectedServer} = require('./classes/LocallyConnectedServer')
const {v4: makeID} = require('uuid')
const {EventCode} = require('./classes/EventCode')

const GameServer = new LocallyConnectedServer('client')

// Socket IO Server Stuff
GameServer.io.on(EventCode.connection, (socket) => {
    console.log("It appears we have a visitor. Put on the tea.", socket.id)
    socket.on(EventCode.disconnect, (reason) => {
        // player.leave('players')
        console.log(`${socket.id} disconnected. Reason: ${reason}`)
    })
    // Board Events
    // The Board connects to the server
    socket.on(EventCode.boardJoin, (id, callback) =>{
        // The Board gets assigned to a room for the board only.
        socket.join('board')
        console.log(`Board joined board room`)
        // Confirm with the board that it has been assigned the room.
        callback('Room joined')
    })
    // The Board requests a gamestate, usually after a refresh or disconnect event.
    socket.on(EventCode.gamestateRequest, (id, callback) => {
        console.log(`Board request from: ${id}`)
        // The server sends a copy of the game state to the board.
        callback(WOF)
    })
    // Direct to player message
    socket.on('yourTurn', (idFromHandler) => {
        socket.to(idFromHandler).emit('yourTurn', "You're up, dingus.")
    })

    // Player Events
    // A Player connects to the server
    socket.on(EventCode.playerJoin, (id, callback) =>{
        console.log('Player Join: ', id)
        if (!WOF.PlayerHandler.isPlayerExists(id)){
            // If the player does not exist in the player list, aka truly new player, create a new ID for them, add it to the list, and return the ID to the client for identity storage.
            console.log(`Creating new player.`)
            let newPlayerID = makeID()
            WOF.PlayerHandler.addPlayer(newPlayerID)
            callback(WOF.PlayerHandler.getPlayer(newPlayerID))
        } else {
            // If the player exists, send them their player ID to confirm connection.
            console.log(WOF.PlayerHandler.getPlayer(id))
            callback(WOF.PlayerHandler.getPlayer(id))
        }
        // Add them to the players channel
        socket.join('players')
        console.table(WOF.PlayerHandler.players)
        console.log(`Player joined room`)
    })
    
    // A player sends spin data to the server
    socket.on(EventCode.speedData, (data) => {
        console.log(data)
        // Check if the player is the active player, ignore all other submissions (let the players have freedom to fiddle with it)
        // if(WOF.PlayerHandler.isActivePlayer(data.id)){
            let spinPower = WOF.Wheel.spinWheel(data.value)
            console.log(spinPower)
            GameServer.io.to('board').emit('spinValue', spinPower)
        // }
    })
    socket.on(EventCode.nameChange, (data) => {
        console.log(data)
        let player = WOF.PlayerHandler.getPlayer(data.id)
        player.setName(data.name)
        GameServer.io.to('board').emit('playerUpdate', WOF.PlayerHandler.players)
    })
    socket.on(EventCode.colorChange, (data) => {
        console.log(data)
        let player = WOF.PlayerHandler.getPlayer(data.id)
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