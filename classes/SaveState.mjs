/**
 * @import {WOFGame} from './WOFGame.mjs
 * @import {Board} from './Board.mjs
 * @import {Wheel} from './Wheel.mjs
 * @import {PlayerHandler} from './PlayerHandler.mjs
 * @import {Player} from './Player.mjs
 * @import { BoardQueue } from './BoardQueue.mjs'
 */

import { Logger } from './Logger.mjs'


export class SaveState {
    /**
     * 
     * @param {WOFGame} WOFGameObject 
     */
    constructor(WOFGameObject){
        this.Board = this.generateBoard(WOFGameObject.Board)
        this.PlayerHandler = this.generatePlayerHandler(WOFGameObject.PlayerHandler)
        this.Wheel = this.generateWheel(WOFGameObject.Wheel)
        this.PuzzleQueue = WOFGameObject.PuzzleQueue ? this.generatePuzzleQueue(WOFGameObject.PuzzleQueue) : new Array(0)
        this.isWaitingForSpin = WOFGameObject.isWaitingForSpin
        this.isWaitingForGuess = WOFGameObject.isWaitingForGuess
    }
    /**
     * 
     * @param {Board} BoardObject 
     */
    generateBoard(BoardObject){
        return {
            phrase: BoardObject.phrase,
            clue: BoardObject.clue,
            guessedLetters: BoardObject.guessedLetters,
            isSolved: BoardObject.isSolved
        }
    }
    /**
     * 
     * @param {Wheel} WheelObject
     * @returns {Wheel} Wheel minus the logger
     */
    generateWheel(WheelObject){
        let wheelData = {}
        for (const key in WheelObject) {
            if(WheelObject[key] instanceof Logger){
                continue
            }
            wheelData[key] = WheelObject[key]
        }
        return wheelData
    }
    /**
     * 
     * @param {PlayerHandler} PlayerHandler
     * @returns {PlayerHandler} PlayerHandler minus the logger
     */
    generatePlayerHandler(PlayerHandler){
        let playerData = {
            players: [],
            turnIndicator: PlayerHandler.turnIndicator
        }
        for (const player of PlayerHandler.players) {
            let newPlayerData = {}
            for (const property in player) {
                newPlayerData[property] = player[property]
            }
            playerData.players.push(newPlayerData)
        }
        return playerData
    }
    /**
     * @param {BoardQueue} PuzzleQueueObject 
     */
    generatePuzzleQueue(PuzzleQueueObject){
        return PuzzleQueueObject.items
    }
}