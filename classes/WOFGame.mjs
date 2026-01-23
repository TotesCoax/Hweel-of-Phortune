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
import { BoardQueue } from './BoardQueue.mjs'

export class WOFGame{
    /**
     * If no values are provided it makes a default game. Otherwise you can supply values to create a game from a previous game state.
     * @param {string} clue Clue for the puzzle
     * @param {string} phrase Phrase for the puzzle
     * @param {Array} sections Sections of the wheel array, mix of numbers and strings
     * @param {Player[]} players Array of players
     */
    constructor(clue, phrase, sections, players){
        /** @type {Board} */
        this.Board = new Board(clue, phrase)
        /** @type {Wheel} */
        this.Wheel = new Wheel(sections)
        /** @type {PlayerHandler} */
        this.PlayerHandler = new PlayerHandler(players)
        /** @type {boolean} */
        this.isWaitingForSpin = false
        /** @type {boolean} */
        this.isWaitingForGuess = false
        /** @type {BoardQueue} */
       this.PuzzleQueue = new BoardQueue()
       this.Board.revealAllLetters()
    }

    // Setup Functions
    /**
     * 
     * @param {string} clue 
     * @param {string} phrase 
     */
    startNewRound(clue, phrase){
        this.createNewBoard(clue, phrase)
        this.PlayerHandler.resetScoresToZero()
        this.PlayerHandler.setActivePlayer()
        // For now, let's not scale up point values
        this.Wheel.shuffleSections()
    }
    createNewBoard(clue, phrase){
        this.Board = new Board(clue, phrase)
    }
    shuffleWheel(){
        this.Wheel.shuffleSections()
    }
    enqueuePuzzles(arrayOfCluesAndPuzzles){
        this.PuzzleQueue.populateQueue(arrayOfCluesAndPuzzles)
        console.log(this.PuzzleQueue)
        console.log(Object.getPrototypeOf(this.PuzzleQueue))
    }
    nextPuzzle(){
        let nextPuzz = this.PuzzleQueue.dequeue()
        this.startNewRound(nextPuzz.clue, nextPuzz.puzzle)
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
    /**
     * 
     * @param {string} guess 
     * @param {string} playerID 
     * @returns {Player} returns Player object of current turn's player
     */
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

        if (Number.isNaN(this.Wheel.getWheelValue())){
            this.handleSpecialSpace(wheelValue)
            return false
        }


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

    handleSpecialSpace(value){
        console.log(`Special space: ${value}`)
        switch (value) {
            case 'bankrupt':
                this.PlayerHandler.getCurrentPlayer().setScore(0)
                this.PlayerHandler.advanceTurn()
                break;
            case 'lose a turn':
                this.PlayerHandler.advanceTurn()
                break;
        
            default:
                break;
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

        if (guessResult <= 0){
            return false
        }        
        player.updateScore(wheelValue * guessResult)
        console.table(this.PlayerHandler.players)
        return true
    }

    /**
     * 
     * @param {Letter} letter 
     * @param {Player} player 
     */
    handleVowel(letter, player){
        if (player.score <= 250){
            return false
        }

        let guessResult = this.Board.handleGuess(letter.character)

        if (guessResult < 0){
            return false
        }
        console.log(player.score)
        player.updateScore(-250)
        console.table(this.PlayerHandler.players)
        return true
    }

    /**
     * 
     * @returns {object}
     */
    getGamestate(){
        this.PlayerHandler.setActivePlayer()
        return {
            Board: this.Board,
            Wheel: this.Wheel,
            PlayerHandler: this.PlayerHandler
        }
    }
    /**
     * 
     * @param {number} speedValue 
     * @returns {{start: number, power: number, end: number, index: number}}
     */
    spinWheel(speedValue){
        let startingDeg = this.Wheel.getCurrentDeg(),
            spinPower = this.Wheel.spinWheel(speedValue),
            endingDeg = this.Wheel.getCurrentDeg(),
            wheelIndex = this.Wheel.getWheelIndex()
        
        console.log(`Current Value: ${this.Wheel.getWheelValue()}`)
        this.handleSpecialSpace(this.Wheel.getWheelValue())
        let spinData = {start: startingDeg, power: spinPower, end: endingDeg, index: wheelIndex}
        console.table(spinData)
        return spinData
    }

    solvedPuzzle(){
        this.Board.revealAllLetters()
        this.PlayerHandler.getCurrentPlayer().saveRoundScoretoTotalScore()
    }

    //Server Related

    handlePlayerDisconnect(socketID){
        if(this.PlayerHandler.getPlayer(socketID)){
            this.PlayerHandler.getPlayer(socketID).setConnectedStatus(false)
            console.table(this.PlayerHandler.players)
        }
    }

    getSocketIDForActivePlayer(){
        return this.PlayerHandler.getCurrentPlayer().socketID
    }
    /**
     * 
     * @param {boolean} value 
     */
    setWaitingForGuess(value){
        this.isWaitingForGuess = value
    }
    /**
     * 
     * @param {boolean} value 
     */
    setWaitingForSpin(value){
        this.isWaitingForSpin = value
    }


    createTestEnvironment(){
        console.log('Creating Test players')
        this.PlayerHandler.addPlayer('aaaa', '1111')
        this.PlayerHandler.addPlayer('bbbb', '2222')
        this.PlayerHandler.addPlayer('cccc', '3333')
        this.PlayerHandler.addPlayer('dddd', '4444')
        this.PlayerHandler.addPlayer('eeee', '5555')
        this.PlayerHandler.addPlayer('ffff', '6666')
        console.log('Generating random scores')
        this.PlayerHandler.players.forEach(player => player.setScore(this.Wheel.getRandomValue(1,20)))
        console.log('Applying custom colors')
        this.PlayerHandler.players[0].setColor('#ff0000')
        this.PlayerHandler.players[1].setColor('#89cff0')
        this.PlayerHandler.players[2].setColor('#ee82ee')
        this.PlayerHandler.players[3].setColor('#000')
        this.PlayerHandler.players[4].setColor('#fff')
        this.PlayerHandler.players[5].setColor('#ffa500')
        console.table(this.PlayerHandler.players)
        this.PlayerHandler.players[4].setConnectedStatus(false)
    }


}