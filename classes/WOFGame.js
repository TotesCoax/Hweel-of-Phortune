const {Board} = require('./Board')
const {Wheel} = require('./Wheel')
const {PlayerHandler} = require('./PlayerHandler')
const {Letter} = require('./Letter')
const { Player } = require('./Player')
// const { create } = require('qrcode')


class WOFGame{
    /**
     * If no values are provided it makes a default game. Otherwise you can supply values to create a game from a previous game state.
     * @param {string} clue Clue for the puzzle
     * @param {string} phrase Phrase for the puzzle
     * @param {Array} sections Sections of the wheel array, mix of numbers and strings
     * @param {Player[]} players Array of players
     */
    constructor(clue, phrase, sections, players){
        this.Board = new Board(clue, phrase)
        this.Wheel = new Wheel(sections)
        this.PlayerHandler = new PlayerHandler(players)
        this.isWaitingForSpin = false
        this.isWaitingForGuess = false
    }

    // Setup Functions
    /**
     * 
     * @param {string} clue 
     * @param {string} phrase 
     */
    startNewRound(clue, phrase){
        this.createNewBoard(clue, phrase)
        // For now, let's not scale up point values
        this.Wheel.shuffleSections()
    }
    createNewBoard(clue, phrase){
        this.Board = new Board(clue, phrase)
    }
    shuffleWheel(){
        this.Wheel.shuffleSections()
    }

    // Utility functions
    /**
     * 
     * @param {string} letter 
     * @returns {Letter}
     */
    parseGuess(char){
        return new Letter(char)
    }



    // Gameplay functions

    playerGuess(guess, playerID){
        let result = this.handleGuess(guess, playerID)
        if(!result){
            this.PlayerHandler.advanceTurn()
        }
        return this.PlayerHandler.getCurrentPlayer()
    }

    /**
     * 
     * @param {string} guess 
     * @param {Player} player 
     * @returns {boolean} true if successful, false if not
     */
    handleGuess(guess, playerID){
        let letter = new Letter(guess),
            player = this.PlayerHandler.getPlayer(playerID)
        if (letter.isVowel){
            return this.handleVowel(letter, player)
        }
        if (letter.isLetter){
            return this.handleConsonant(letter, player)
        }
    }
    /**
     * 
     * @param {Letter} letter 
     * @param {Player} player 
     */
    handleConsonant(letter, player){
        let wheelValue = this.Wheel.getWheelValue(),
            guessResult = this.Board.handleGuess(letter.character)

        if (guessResult == 0){
            return false
        }
        player.score += (wheelValue * guessResult)
        return true
    }

    /**
     * 
     * @param {Letter} letter 
     * @param {Player} player 
     */
    handleVowel(letter, player){
        let guessResult = this.Board.handleGuess(letter)

        if (guessResult == 0){
            return false
        }
        player.score -= 250
        return true
    }

}

module.exports = { WOFGame }