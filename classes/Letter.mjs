export class Letter{
    constructor(char){
        this.character = ''
        this.revealed = false
        this.isVowel = false
        this.isLetter = false
        this.isPunc = false
        this.isSpace = false
        this.processCharacter(char)
    }
    /**
     * 
     * @param {string} char 
     */
    processCharacter(char){
        if(char.length != 1){
            console.log("only single characters allowed for letter spaces")
            return
        }
        this.character = char.toUpperCase()
        this.isLetter = this.setLetter()
        this.isVowel = this.setVowel()
        this.isPunc = this.setPunc()
        if(this.isPunc){
            this.revealed = true
        }
        if(this.isLetter || this.isPunc){
            this.isSpace = true
        }
    }
    /**
     * 
     * @param {string} char 
     * @returns {boolean}
     */
    setVowel(char){
        return 'AEIOU'.includes(this.character)
    }
    /**
     * 
     * @param {string} char 
     * @returns {boolean}
     */
    setLetter(char){
        return 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().includes(this.character)
    }
    /**
     * 
     * @param {string} char 
     * @returns {boolean}
     */
    setPunc(char){
        return '.,\'\"?!&'.toUpperCase().includes(this.character)
    }
    revealLetter(){
        this.revealed = true
    }
}

// module.exports = { Letter }