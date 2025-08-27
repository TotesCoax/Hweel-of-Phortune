const {Player} = require("./Player")

class PlayerHandler{
    /**
     * @param {Player[]} players 
     */
    constructor(players){
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
    addPlayer(){
        let newPlayer = new Player()
        this.players.push(newPlayer)
        return newPlayer.id
    }
    findPlayer(playerId){
        return this.players.findIndex(seat => seat.id = playerId)
    }
}

module.exports = { PlayerHandler }