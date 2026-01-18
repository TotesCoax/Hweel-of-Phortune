/**
 * @import { Board } from '../../classes/Board.mjs'
 * @import { Letter } from '../../classes/Letter.mjs'
 */

export class RouletterBoardRender {
    /**
     * 
     * @param {string} containerHook - id for element to target
     */
    constructor(containerHook){
        /**
         * @type {HTMLDivElement}
         */
        this.boardElement = document.getElementById(containerHook)
    }
    clearChildren(){
        while (this.boardElement.firstChild){
            this.boardElement.lastChild
        }
    }
    /**
     * 
     * @param {Letter} data 
     */
    renderSpace(data){
        let divHolder = document.createElement('div'),
            letterEL = document.createElement('p')

        if (data.isSpace){
            divHolder.classList.add('game-space')
        }
        if (data.isRevealed){
            letterEL.innerText = data.character
            letterEL.classList.add('revealed')
        }
        letterEL.classList.add('processed')
        divHolder.append(letterEL)
        return divHolder
    }
    /**
     * 
     * @param {Letter[]} row 
     */
    renderRow(row){
        row.forEach(letter => {
            let letterContainer = this.renderSpace(letter)
            this.boardElement.append(letterContainer)
        })
    }
}