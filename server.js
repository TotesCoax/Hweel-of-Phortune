import { LocallyConnectedServer } from './classes/LocallyConnectedServer.mjs'
import { v4 as makeID } from 'uuid'
import { EventCode } from './client/classes/EventCode.js'

import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Game imports
import { WOFGame } from './classes/WOFGame.mjs'
import { CSVParser } from './classes/CSVParser.mjs'

const GameServer = new LocallyConnectedServer('client')

// Socket IO Server Stuff
GameServer.io.on(EventCode.connection, (socket) => {
    console.log("It appears we have a visitor. Put on the tea.", socket.id)
    socket.on(EventCode.disconnect, (reason) => {
        console.log(WOF.PlayerHandler.getPlayer(socket.id))
        WOF.handlePlayerDisconnect()
        changeNotificationToBoard()
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
        callback(WOF.getGamestate())
    })
    // Solve the puzzle
    socket.on('revealPuzzle', () => {
        WOF.solvedPuzzle()
        changeNotificationToBoard()
    })
    // Direct to player message
    function notificationToActivePlayer(){
        let currentPlayer = WOF.getSocketIDForActivePlayer()
        socket.to(currentPlayer).emit('yourTurn', "You're up, dingus")
    }
    // Notice to Board screen that a change has occured and needs to rerender.
    function changeNotificationToBoard(){
        GameServer.io.to('board').emit('playerUpdate', WOF.getGamestate())
    }

    socket.on(EventCode.letterSubmission, (data) => {
        console.log(`${data, WOF.PlayerHandler.getCurrentPlayer().name}'s guess: ${data}`)
        WOF.playerGuess(data, WOF.PlayerHandler.getCurrentPlayer().gameID)
        changeNotificationToBoard()
    })

    socket.on('gameFile', (data) => {
        console.log(data)
        WOF.PuzzleQueue.populateQueue(CSVParser.csvToArray(data))
        WOF.createNewBoard(WOF.nextPuzzle())
        notificationToActivePlayer()
        changeNotificationToBoard()
    })

    socket.on('nextRound', (data) => {
        console.log(data)
        WOF.nextPuzzle()
        notificationToActivePlayer()
        changeNotificationToBoard()
    })

    //Manual Mode

    socket.on('manualAdd', (data) => {
        console.log(`Adding new player manually: ${data}`)
        WOF.PlayerHandler.addPlayer(data, 'manual')
        WOF.PlayerHandler.getPlayer(data).setName(data)
        changeNotificationToBoard()
    })

    socket.on('manualRemove', (data) => {
        console.log(`Removing player manually: ${data}`)
        let removed = WOF.PlayerHandler.removePlayer(data)
        changeNotificationToBoard()
    })

    socket.on('offlineSpin', (data) => {
        console.log('Offline spin', data)
            let startingDeg = WOF.Wheel.currentDeg,
            spinValue = (WOF.Wheel.getRandomValue(1, 50)/100),
            spinPower = WOF.spinWheel(spinValue),
            endingDeg = WOF.Wheel.currentDeg,
            wheelIndex = WOF.Wheel.getWheelIndex()
        console.log(`Current Value: ${WOF.Wheel.getWheelValue()}, SpinValue: ${spinValue}`)
        WOF.handleSpecialSpace(WOF.Wheel.getWheelValue())
        console.log(`Starting: ${startingDeg}, Power: ${spinPower}, Ending: ${endingDeg}`)
        let spinData = {start: startingDeg, power: spinPower, end: endingDeg, index: wheelIndex}
        console.log(spinData)
        GameServer.io.to('board').emit('wheelSpin', spinData)
    })

    // Player Events
    // A Player connects to the server
    socket.on(EventCode.playerJoin, (id, callback) =>{
        console.log('Player Join: ', id)
        if (!WOF.PlayerHandler.isPlayerExists(id)){
            // If the player does not exist in the player list, aka truly new player, create a new ID for them, add it to the list, and return the ID to the client for identity storage.
            console.log(`Creating new player.`)
            let newPlayerID = makeID()
            WOF.PlayerHandler.addPlayer(newPlayerID, socket.id)
            changeNotificationToBoard()
            callback(WOF.PlayerHandler.getPlayer(newPlayerID))
        } else {
            // If the player exists, send them their player ID to confirm connection.
            console.log(WOF.PlayerHandler.getPlayer(id))
            WOF.PlayerHandler.getPlayer(id).setConnectedStatus(true)
            changeNotificationToBoard()
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
        if(WOF.PlayerHandler.isActivePlayer(data.id)){
            let startingDeg = WOF.Wheel.currentDeg,
                spinPower = WOF.spinWheel(data.value),
                endingDeg = WOF.Wheel.currentDeg,
                wheelIndex = WOF.Wheel.getWheelIndex()
            console.log(`Current Value: ${WOF.Wheel.getWheelValue()}`)
            WOF.handleSpecialSpace(WOF.Wheel.getWheelValue())
            console.log(`Starting: ${startingDeg}, Power: ${spinPower}, Ending: ${endingDeg}`)
            let spinData = {start: startingDeg, power: spinPower, end: endingDeg, index: wheelIndex}
            console.log(spinData)
            GameServer.io.to('board').emit('wheelSpin', spinData)
        }
    })
    socket.on(EventCode.nameChange, (data) => {
        let player = WOF.PlayerHandler.getPlayer(data.id)
        player.setName(data.name)
        changeNotificationToBoard()
    })
    socket.on(EventCode.colorChange, (data) => {
        let player = WOF.PlayerHandler.getPlayer(data.id)
        player.setColor(data.color)
        changeNotificationToBoard()
    })
    // Game Actions
    
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


const WOF = new WOFGame()