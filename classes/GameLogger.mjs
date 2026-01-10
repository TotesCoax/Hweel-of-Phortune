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
         * @type {object[]} - Array of log objects
         * @private
        */
        this.history = []
    }
    getHistory(){
        return this.history
    }
    append(line){
        this.history.push(line)
    }
}