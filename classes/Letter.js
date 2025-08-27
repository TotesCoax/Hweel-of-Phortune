class Letter{
    constructor(){
        this.character = ''
        this.revealed = false
        this.isVowel = false
        this.isLetter = false
        this.isPunc = false
        this.isSpace = false
    }
    checkVowel(){
        return 'aeiou'.toUpperCase().split('').findIndex(letter => letter === this.character) >= 0
    }
    checkLetter(){
        return 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('').findIndex(letter => letter === this.character) >= 0
    }
    checkPunc(){
                return '.,\'\"?!&'.toUpperCase().split('').findIndex(letter => letter === this.character) >= 0
    }
    /**
     * 
     * @param {string} char 
     */
    assignCharacter(char){
        if(char.length != 1){
            throw 'only single characters allowed for letter spaces'
        }
        this.character = char.toUpperCase()
        this.isVowel = this.checkVowel()
        this.isLetter = this.checkLetter()
        if(this.isPunc){
            this.revealed = true
        }
        if(this.isLetter || this.isPunc){
            this.isSpace = true
        }
    }
    revealLetter(){
        this.revealed = true
    }
}

module.exports = { Letter }