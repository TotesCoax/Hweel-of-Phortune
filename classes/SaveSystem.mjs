import fs from 'fs/promises'
import { Logger } from './Logger.mjs'
import { SaveState } from './SaveState.mjs'


/**
 * @import {FileHandle} from 'fs/promises'
 * @import {WOFGame} from './WOFGame.mjs
 * @import {Board} from './Board.mjs
 * @import {Wheel} from './Wheel.mjs
 * @import {PlayerHandler} from './PlayerHandler.mjs
 * @import {Player} from './Player.mjs
 */

export class SaveSystem {
    /**
     * @param {string} logFileDirectory 
     * @param {string} filePath location of the save file
     * @param {object} options  
     * @param {WOFGame} gameObject 
     */
    constructor(logFileDirectory, filePath, options){
        this.filePath = filePath
        this.stateLogger = new Logger(logFileDirectory, "SaveState")
    }

    /**
     * 
     * @param {WOFGame} gameObject 
     */
    createState(gameObject){
        return new SaveState(gameObject)
    }

    /**
     * 
     * @param {WOFGame} data 
     */
    async updateState(data){
        let toWrite = JSON.stringify(this.createState(data))
        try {
            let saveState = await fs.open(this.filePath, "r+")
            this.stateLogger.log('State File opened, File Handle established.')
            saveState.writeFile(toWrite).then(saveState.close())
        } catch (error) {
            this.stateLogger.error(`SaveState file not opened: ${error}`)

            let newState = JSON.stringify(this.createState(data)),
            fileHandle = await fs.open('./gamestate/StateBackup.txt', "w")
            fileHandle.write(newState).then(fileHandle.close())

            this.stateLogger.log(`State back up triggered.`)
        }
    }

    /**
     * 
     * @param {string} pathlike 
     * @returns {WOFGame}
     */
    async openState(pathlike){
        try {
            let data = await fs.readFile(pathlike, "utf-8"),
                returnJSON = JSON.parse(data)

            return returnJSON
        } catch (error){
            this.stateLogger.log(`Failed to open file: ${error}`)
        }
    }
}