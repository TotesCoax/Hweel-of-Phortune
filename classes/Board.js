const {Letter} = require('./Letter')

class Board{
    /**
     * @param {string} clue Clue to display to players
     * @param {string} phrase The Phrase the players need to solve
     */
    constructor(clue = 'Initial Setup', phrase = "Board has been created"){
        this.rowCount = 4
        this.colCount = 12
        this.maxChar = this.rowCount * this.colCount
        this.phrase = phrase.trim().toUpperCase()
        this.tooManyChars()
        this.board = this.generateBoard()
        this.racks = this.rackRows(this.phrase)
        this.populateBoard(this.racks)
        this.guessedLetters = []
        this.clue = clue
    }
    /**
     * Checks if phrase is too long to parse into the board.
     */
    tooManyChars(){
        if(this.phrase > this.maxChar){
            console.log("This phrase is too large to fit the board.")
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
     * Generates a black board full of Letter objects. 
     * @returns {Letter[][]}
     */
    generateBoard(){
        let board = []
        for (let index = 0; index < this.rowCount; index++) {
            let col = []
            for (let index = 0; index < this.colCount; index++) {
                let blankSpace = new Letter(" ")
                col.push(blankSpace)                
            }
            board.push(col)            
        }
        return board
    }
    /**
     * Parses the phrase into letters, and formats it so it fits words onto each row with no breaking.
     * @returns {string[]}
     */
    rackRows(){
        let words = this.splitByWord(this.phrase),
            rack = '',
            rows = []
        for (let i = 0; i < words.length; i++) {
            // check if next word would break past column count. if yes push to return array and reset otherwise continue
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
    /**
     * Finds which index to start on each row, roughly centering the row of letters.
     * @param {stringtring[]} row 
     * @returns {number} 
     */
    findStartingSpot(row){
        return Math.round((this.colCount - row.length)/2)
    }
    /**
     * 
     * @param {Letter[]} rowFromBoard Row from the generated board to be filled.
     * @param {string[]} parsedRow Array of parsed/racked letters to apply to board.
     */
    assignLettersToRow(rowFromBoard, parsedRow){
        let index = this.findStartingSpot(parsedRow)
        for (let letter of parsedRow) {
            rowFromBoard[index] = new Letter(letter)
            index++
        }
    }
    /**
     * Fills the generated board with parsed letters. It's not dynamic right now, but I would need to overhaul quite a bit to handle more than 4 rows.
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
     * For guesses, times returned number by the wheel amount, for vowels subtract cost of vowels.
     * @param {string} letter
     * @returns {number} number of found letters
     */
    handleGuess(letter){
        let guessLetter = letter.toUpperCase()
        if(this.letterAlreadyGuessed(guessLetter)){
            console.log("Letter already guessed.")
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
    /**
     * 
     * @param {string} guessLetter 
     * @returns {boolean} Whether or not the letter is recorded in the guessed letters array.
     */
    letterAlreadyGuessed(guessLetter){
        return this.guessedLetters.findIndex(letter => letter === guessLetter) >= 0
    }
}

module.exports = { Board }