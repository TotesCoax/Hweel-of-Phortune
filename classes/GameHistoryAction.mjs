export class GameHistoryAction {
    constructor(agent, action){
        this.agent = agent
        this.action = action
        this.status = 'active'
    }
}