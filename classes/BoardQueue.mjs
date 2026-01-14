import { BasicQueue } from "./BasicQueue.mjs"
import { BoardPuzzle } from "./BoardPuzzle.mjs"

/**
 * @typedef {object} BoardQueue
 * @prop {BoardPuzzle[]} BoardQueue.items
 */
export class BoardQueue extends BasicQueue {
    /**
     * 
     * @param {string[][]} arrayOfParsedPuzzles 
     */
    constructor(arrayOfParsedPuzzles){
        super()
        /**
         * @type {BoardPuzzle[]}
         */
        this.items = parsePuzzlesNoHeaders(arrayOfParsedPuzzles)
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
        return newQueue
    }
    /**
     * 
     * @returns {BoardPuzzle}
     */
    dequeue(){
        return super.dequeue()
    }
}