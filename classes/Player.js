
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
    updateScore(number){
        this.score += number
    }
    setScore(number){
        this.score = number
    }
    setColor(hex){
        this.color = hex
    }
    setName(string){
        this.name = string
    }
}

module.exports = { Player }