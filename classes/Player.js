
class Player{
    /**
     * 
     * @param {number} id unique ID for the player 
     */
    constructor(id){
        this.id = id
        this.name = ''
        this.score = 0
        this.color = ''
    }
    /**
     * Increments the score for player.
     * @param {number} number Amount to add to score, include "-" to reduce score
     */
    updateScore(number){
        this.score += number
    }
    /**
     * Sets score to a specific number.
     * @param {number} number Amount to set score to.
     */
    setScore(number){
        this.score = number
    }
    /**
     * Assigns a hex code to the player for the board to render a color.
     * @param {string} hex A hexadecimal code for a color, provide by player client.
     */
    setColor(hex){
        this.color = hex
    }
    /**
     * Set a name for the player for the board client to display.
     * @param {string} string 
     */
    setName(string){
        this.name = string
    }
}

module.exports = { Player }