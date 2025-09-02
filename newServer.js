const {LocallyConnectedServer} = require('./classes/LocallyConnectedServer')

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
    NewGame.generateQRCodeForServer(addressInfo.port, 'player')
})

const {WOFGame} = require('./classes/WOFGame')

const game = new WOFGame()

console.log(game)