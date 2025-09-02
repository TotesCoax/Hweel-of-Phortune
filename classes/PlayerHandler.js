const {Player} = require("./Player")

class PlayerHandler{
    /**
     * @param {Player[]} players 
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
    currentPlayer(){
        return this.players[this.turnIndicator]
    }
    nextPlayer(){
        if(!this.players[this.turnIndicator+1]){
            return this.players[0]
        }
        return this.players[this.turnIndicator+1]
    }
    /**
     * Adds a new player class to the array and returns their game ID, to be sent to client for saving.
     * @returns {string} uuid for game session
     */
    addPlayer(id){
        if (this.findPlayer(id) >= 0){
            throw 'Player already exists.'
        }
        let newPlayer = new Player(id)
        this.players.push(newPlayer)
        return newPlayer.id
    }
    removePlayer(id){
        if (this.findPlayer(id) < 0){
            throw 'No player found'
        }
        let removedPlayer = this.players.splice(this.findPlayer(id))
        return removedPlayer
    }
    findPlayer(playerId){
        return this.players.findIndex(seat => seat.id === playerId)
    }
}

module.exports = { PlayerHandler }