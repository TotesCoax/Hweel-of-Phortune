import { BasicQueue } from "./BasicQueue.mjs"
import { BoardPuzzle } from "./BoardPuzzle.mjs"

/**
 * @typedef {object} BoardQueue
 * @prop {BoardPuzzle[]} BoardQueue.items
 */
export class BoardQueue extends BasicQueue {
    constructor(){
        super()
    }
}