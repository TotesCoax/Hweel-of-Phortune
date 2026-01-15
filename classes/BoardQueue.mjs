import { BasicQueue } from "./BasicQueue.mjs"
import { BoardPuzzle } from "./BoardPuzzle.mjs"

export class BoardQueue extends BasicQueue {
    /**
     * 
     * @param {string[][]} arrayOfParsedPuzzles 
     */
    constructor(){
        super()
    }
    /**
     * 
     * @param {string[][]} puzzlesArray 
     * @returns {BoardPuzzle[]}
     */
    parsePuzzleArrayWithHeaders(puzzlesArray){
        let newQueue = []
        for (const puzzle of puzzlesArray) {
            newQueue.push(new BoardPuzzle(puzzle[0],puzzle[1]))
        }
        console.log(newQueue)
        return newQueue
    }
    populateQueue(array){
        this.items = this.parsePuzzleArrayWithHeaders(array)
    }
    /**
     * 
     * @returns {BoardPuzzle}
     */
    dequeue(){
        return super.dequeue()
    }
}