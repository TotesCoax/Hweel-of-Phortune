import { GameHistoryAction } from './GameHistoryAction.mjs'

export class Gamelogger {
    /**
     * 
     * @param {string} sessionID 
     */
    constructor(sessionID){
        /**
         * @type {string} - ID for the game session
         */
        this.sessionID = sessionID
        /**
         * @type {GameHistoryAction[]} - Array of log objects
         * @private
        */
        this.history = []
    }
    getHistory(){
        return this.history.filter(item => item.status == 'ACTIVE' )
    }
    append(entry){
        this.history.push(entry)
    }
    write(){
    }

    
}