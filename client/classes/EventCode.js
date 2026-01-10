/**
 * Enum for list of valid codes
 * @readonly
 * @enum {string}
 */
const EventCode = Object.freeze({
    //General Codes
    connection: "connection",
    disconnect: "disconnect",
    //Board Codes
    boardJoin: "boardJoin",
    gamestateRequest: "gamestateRequest",
    //Player Codes
    playerJoin: "playerJoin",
    speedData: "speedData",
    nameChange: "nameChange",
    colorChange: "colorChange",
    letterSubmission: "letterSubmission"
})

export { EventCode }