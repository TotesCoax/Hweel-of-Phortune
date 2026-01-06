const {Player} = require("./Player")

class PlayerHandler{
    /**
     * @param {Player[]} players - an array of Player objects
     */
    constructor(players = []){
        this.players = players
        this.turnIndicator = 0
    }
    shufflePlayers(){
        for (let i = this.players.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = this.players[i]
            this.players[i] = this.players[j]
            this.players[j] = temp
        }
    }
    advanceTurn(){
        if(this.turnIndicator + 1 >= this.players.length){
            this.turnIndicator = 0
            return
        }
        this.turnIndicator++
    }
    retreatTurn(){
        if(this.turnIndicator - 1 <= this.players.length){
            this.turnIndicator = 0
            return
        }
        this.turnIndicator--
    }
    getCurrentPlayer(){
        return this.players[this.turnIndicator]
    }
    setCurrentPlayer(id){
        this.turnIndicator = this.getPlayerIndex(id)
    }
    movePlayerInTurnOrder(){
        //Not Implemented yet, but I think it would be fun to have a wheel space move players around in turn order. Either to specific spots or +/- number of spaces
    }
    swapPlayersInTurnOrder(){
        // Not Implemented yet, but sounds like a fun thing to add
    }
    getNextPlayer(){
        if(!this.players[this.turnIndicator+1]){
            return this.players[0]
        }
        return this.players[this.turnIndicator+1]
    }
    /**
     * Adds a new player class to the array and returns their game ID, to be sent to client for saving.
     * @returns {string} uuid for game session
     */
    addPlayer(gameID, socketID){
        if (this.isPlayerExists){
            console.log("Player already exists.")
            return
        }
        let newPlayer = new Player(gameID, socketID)
        this.players.push(newPlayer)
        return newPlayer.id
    }
    removePlayer(id){
        if (!this.isPlayerExists){
            console.log("No player found.")
            return
        }
        let removedPlayer = this.players.splice(this.findPlayer(id))
        return removedPlayer
    }
    isPlayerExists(id){
        return this.getPlayerIndex(id) > 0
    }
    isActivePlayer(id){
        return this.getPlayerIndex(id) == this.turnIndicator
    }
    getPlayerIndex(playerId){
        return this.players.findIndex(seat => seat.gameID === playerId)
    }
    getPlayer(playerId){
        return this.players[this.getPlayerIndex(playerId)]
    }
    getPlayersSortedByScore(){
        return this.players.toSorted((a, b) => a.score - b.score)
    }
    /**
     * 
     * @param {number} numPlayers Number of players you want returned from top
     */
    getTopPlayers(numPlayers){
        let sorted = this.getPlayersSortedByScore(),
            players = []
        for (let index = 0; players.length < numPlayers; index++) {
            players.push(sorted[index])
        }
        return players
    }
    /**
     * 
     * @param {number} numPlayers Number of players you want returned from top
     */
    getBottomPlayers(numPlayers){
        let sorted = this.getPlayersSortedByScore(),
            players = []
        for (let index = sorted.length - 1; players.length < numPlayers; index--) {
            players.push(sorted[index])
        }
        return players
    }
}

module.exports = { PlayerHandler }