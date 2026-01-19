/**
 * @import { Board } from '../../classes/Board.mjs'
 * @import { Letter } from '../../classes/Letter.mjs'
 */

export class RouletterBoardRender {
    /**
     * 
     * @param {string} containerHook - id for board div to target
     * @param {string} clueHook - id for clue container
     */
    constructor(puzzleHook, clueHook){
        /**
         * @type {HTMLDivElement}
         */
        this.boardElement = document.getElementById(puzzleHook)
        /**
         * @type {HTMLDivElement}
         */
        this.clueElement = document.getElementById(clueHook)
    }
    /**
     * 
     * @param {HTMLDivElement} element 
     */
    clearChildren(element){
        while (element.firstChild){
            element.lastChild
        }
    }
    /**
     * 
     * @param {Letter} data 
     */
    renderSpace(data){
        let tdHolder = document.createElement('td'),
            letterEL = document.createElement('p')

        if (data.isSpace){
            tdHolder.classList.add('game-space')
        }
        if (data.isRevealed){
            letterEL.innerText = data.character
            letterEL.classList.add('revealed')
        }
        letterEL.classList.add('processed')
        tdHolder.append(letterEL)
        return tdHolder
    }
    /**
     * 
     * @param {Letter[]} row 
     */
    renderRow(row){
        let rowContainer = document.createElement('tr')
        row.forEach(letter => {
            let letterContainer = this.renderSpace(letter)
            rowContainer.append(letterContainer)
        })
        return rowContainer
    }
    /**
     * 
     * @param {Letter[][]} array 
     */
    renderBoard(array){
        this.clearChildren(this.boardElement)
        let boardTable = document.createElement('table')
        array.forEach(row => {
            let newRow = this.renderRow(row)
            boardTable.append(newRow)
        })
        let clueEL = this.renderClue()
        this.boardElement.append(clueEL,boardTable)
    }
    /**
     * 
     * @param {string} text 
     * @returns 
     */
    renderClue(text){
        this.clearChildren(this.clueElement)
        let clueTableCap = document.createElement('caption'),
            cluePEL = document.createElement('p')
        
        cluePEL.innerText = text
        clueTableCap.append(cluePEL)
        return clueTableCap
    }
}