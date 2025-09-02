const {Board} = require('./Board')
const {Wheel} = require('./Wheel')
const {PlayerHandler} = require('./PlayerHandler')


class WOFGame{
    /**
     * If no values are provided it makes a default game. Otherwise you can supply values to create a game from a previous game state.
     * @param {string} clue Clue for the puzzle
     * @param {string} phrase Phrase for the puzzle
     * @param {Array} sections Sections of the wheel array, mix of numbers and strings
     * @param {Player[]} players Array of players
     */
    constructor(clue, phrase, sections, players){
        this.Board = new Board(clue, phrase)
        this.Wheel = new Wheel(sections)
        this.PlayerHandler = new PlayerHandler(players)
    }
}

module.exports = { WOFGame }