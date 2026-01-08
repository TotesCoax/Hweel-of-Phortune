// const {Board} = require('./Board.mjs')
// const {Wheel} = require('./Wheel.mjs')
// const {PlayerHandler} = require('./PlayerHandler.mjs')
// const {Letter} = require('./Letter.mjs')
// const { Player } = require('./Player.mjs')

import { Board } from './Board.mjs'
import { Wheel } from './Wheel.mjs'
import { PlayerHandler } from './PlayerHandler.mjs'
import { Letter } from './Letter.mjs'
import { Player } from './Player.mjs'

export class WOFGame{
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
        this.createTestEnvironment()
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
            console.log('Vowel found')
            return this.handleVowel(letter, player)
        }
        if (letter.isLetter){
            console.log('Consonant found')
            return this.handleConsonant(letter, player)
        }
        return false
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
        console.log(player.score)
        player.score += (wheelValue * guessResult)
        console.table(this.PlayerHandler.players)
        return true
    }

    /**
     * 
     * @param {Letter} letter 
     * @param {Player} player 
     */
    handleVowel(letter, player){
        if (player.score < 250){
            return false
        }

        let guessResult = this.Board.handleGuess(letter.character)

        if (guessResult == 0){
            return false
        }
        console.log(player.score)
        player.score -= 250
        console.table(this.PlayerHandler.players)
        return true
    }

    /**
     * 
     * @returns {object}
     */
    getGamestate(){
        return {
            Board: this.Board,
            Wheel: this.Wheel,
            Players: this.PlayerHandler.players
        }
    }

    createTestEnvironment(){
        console.log('Creating Test players')
        this.PlayerHandler.addPlayer('aaaa', '1111', `Player ${this.PlayerHandler.players.length + 1}`)
        this.PlayerHandler.addPlayer('bbbb', '2222', `Player ${this.PlayerHandler.players.length + 1}`)
        this.PlayerHandler.addPlayer('cccc', '3333', `Player ${this.PlayerHandler.players.length + 1}`)
        this.PlayerHandler.addPlayer('dddd', '4444', `Player ${this.PlayerHandler.players.length + 1}`)
        this.PlayerHandler.addPlayer('eeee', '5555', `Player ${this.PlayerHandler.players.length + 1}`)
        this.PlayerHandler.addPlayer('ffff', '6666', `Player ${this.PlayerHandler.players.length + 1}`)
        console.log('Generating random scores')
        this.PlayerHandler.players.forEach(player => player.setScore(this.Wheel.getRandomValue(1,20)))
        console.log('Applying custom colors')
        this.PlayerHandler.players[0].setColor('#ff0000')
        this.PlayerHandler.players[1].setColor('#0000ff')
        this.PlayerHandler.players[2].setColor('#ee82ee')
        this.PlayerHandler.players[3].setColor('#000')
        this.PlayerHandler.players[4].setColor('#fff')
        this.PlayerHandler.players[5].setColor('#ffa500')
        console.table(this.PlayerHandler.players)
    }


}

// module.exports = { WOFGame }