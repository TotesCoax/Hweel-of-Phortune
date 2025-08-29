const {Letter} = require('./Letter')

class Board{
    /**
     * 
     * @param {string} phrase 
     */
    constructor(phrase){
        this.rowCount = 4
        this.colCount = 12
        this.maxChar = this.rowCount * this.colCount
        this.phrase = phrase.trim().toUpperCase()
        this.tooManyChars()
        this.board = this.generateBoard()
        this.racks = this.rackRows(this.phrase)
        this.populateBoard(this.racks)
        this.guessedLetters = []
    }
    tooManyChars(){
        if(this.phrase > this.maxChar){
            throw 'This phrase is too large to fit the board.'
        }
    }
    /**
     * 
     * @param {string} words 
     * @returns {string[]}
     */
    splitByWord(words){
        return words.trim().split(' ')
    }
    /**
     * 
     * @param {number} rowCount 
     * @param {number} colCount 
     * @returns {Letter[][]}
     */
    generateBoard(){
        let board = []
        for (let index = 0; index < this.rowCount; index++) {
            let col = []
            for (let index = 0; index < this.colCount; index++) {
                col.push(new Letter('#'))                
            }
            board.push(col)            
        }
        return board
    }
    getLengthsOfWords(arrayOfWords){
        let charCounts = []

        for (const word of arrayOfWords) {
            charCounts.push(word.length)
        }

        return charCounts
    }
    /**
     * 
     * @returns {string[]}
     */
    rackRows(){
        let words = this.splitByWord(this.phrase),
            rack = '',
            rows = []
        for (let i = 0; i < words.length; i++) {
            // check if next work would break past column count. if yes push to return array and reset otherwise continue
            if(rack.length + words[i].length > this.colCount){
                rows.push(rack)
                rack = ''
            }
            // add word, trim space if first word
            rack = rack.concat(" ", words[i]).trim()
        }
        // Pushes last rack
        rows.push(rack)
        return rows
    }
    findStartingSpot(row){
        return Math.round((this.colCount - row.length)/2)
    }
    /**
     * 
     * @param {Letter[]} rowFromBoard 
     */
    assignLettersToRow(rowFromBoard, parsedRow){
        let index = this.findStartingSpot(parsedRow)
        for (let letter of parsedRow) {
            rowFromBoard[index].assignCharacter(letter)
            index++
        }
    }
    /**
     * 
     * @param {string[]} rackedRows 
     */
    populateBoard(rackedRows){
        switch (rackedRows.length) {
            case 1:
                this.assignLettersToRow(this.board[1], rackedRows)
                break;
            case 2:
                this.assignLettersToRow(this.board[1], rackedRows[0])
                this.assignLettersToRow(this.board[2], rackedRows[1])
                break;
            case 3:
                this.assignLettersToRow(this.board[0], rackedRows[0])
                this.assignLettersToRow(this.board[1], rackedRows[1])
                this.assignLettersToRow(this.board[2], rackedRows[2])
                break;
            case 4:
                this.assignLettersToRow(this.board[0], rackedRows[0])
                this.assignLettersToRow(this.board[1], rackedRows[1])
                this.assignLettersToRow(this.board[2], rackedRows[2])
                this.assignLettersToRow(this.board[3], rackedRows[3])
                break;
        
            default:
                throw `Failed to populate`
        }
    }
    /**
     * Handles guesses and also buying of vowels.
     * For guesses, times returned number by the wheel amount, for voweled multiply the cost of vowels by the returned amount.
     * @param {string} guessLetter 
     * @returns {number} number of found letters
     */
    handleGuess(guessLetter){
        if(this.letterAlreadyGuessed(guessLetter)){
            return guessLetter
        }
        this.guessedLetters.push(guessLetter)
        let numFoundLetters = 0
        for (const row of this.board) {
            for (const letter of row) {
                if(guessLetter === letter.character){
                    letter.revealLetter()
                    numFoundLetters++
                }
            }
        }
        console.log('Letters found:', numFoundLetters, this.guessedLetters)
        return numFoundLetters
    }
    letterAlreadyGuessed(guessLetter){
        return this.guessedLetters.findIndex(letter => letter === guessLetter) >= 0
    }
}

module.exports = { Board }