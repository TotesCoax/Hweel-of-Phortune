export class Letter{
    constructor(char){
        this.character = ''
        this.isRevealed = false
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
        this.isNumber = this.setNumber()
        this.isPunc = this.setPunc()
        if(this.isPunc){
            this.isRevealed = true
        }
        if(this.isLetter || this.isPunc || this.isNumber){
            this.isSpace = true
        }
    }
    /**
     * 
     * @param {string} char 
     * @returns {boolean}
     */
    setVowel(){
        return 'AEIOU'.includes(this.character)
    }
    /**
     * 
     * @param {string} char 
     * @returns {boolean}
     */
    setLetter(){
        return 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().includes(this.character)
    }
    /**
     * 
     * @param {string} char 
     * @returns {boolean}
     */
    setNumber(){
        return '0123456789'.includes(this.character)

    }
    /**
     * 
     * @param {string} char 
     * @returns {boolean}
     */
    setPunc(){
        return '.,\'\"?!&'.toUpperCase().includes(this.character)
    }
    revealLetter(){
        this.isRevealed = true
    }
}

// module.exports = { Letter }