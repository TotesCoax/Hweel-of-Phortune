export class BasicQueue {
    constructor(){
        this.items = []
    }
    enqueue(element){    
        this.items.push(element)
    }
    /**
     * 
     * @returns {false|any} - Returns false if empty 
     */
    dequeue(){
        if(this.isEmpty()){
            return false
        }
        return this.items.shift();
    }
    /**
     * 
     * @returns {false|any} - Returns false if empty 
     */
    peek(){
        if(this.isEmpty()){
            return false
        }
        return this.items[0]
    }
    isEmpty(){
        return this.items.length === 0
    }
    printQueue(){
        let list = []
        this.items.forEach(item => {
            list.push(item)
        })
        return list
    }
}
