const { v4: uuidv4 } = require('uuid')

class Player{
    constructor(){
        this.id = uuidv4()
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