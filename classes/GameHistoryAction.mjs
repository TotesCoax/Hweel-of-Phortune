export class GameHistoryAction {
    constructor(agent, action){
        this.id = `${Date.now()}`
        this.agent = agent
        this.action = action
        /**
         * @type {"ACTIVE"|"REMOVED"}
         */
        this.status = 'ACTIVE'
    }
}