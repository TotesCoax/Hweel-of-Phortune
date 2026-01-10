export class FileHandler {
    constructor(){
        this.pathToFile
    }
    /**
     * 
     * @param {string} csv 
     * @returns 
     */
    csvToMap(csv){
        return csv.split('\r\n').map( line => {
            // Split on commas outside of quotes
            let parsedLine = this.parseOnCommas(line)
            parsedLine.forEach(item => {
                item = this.cleanUpOuterQuotes(item)
            })
        })
    }
    /**
     * 
     * @param {string} line 
     * @returns {string[]} - parsed string
     */
    parseOnCommas(line){
        return line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
    }
    /**
     * 
     * @param {string} string 
     * @returns {string}
     */
    cleanUpOuterQuotes(string){
        return string.replaceAll("\"\"", ";").replaceAll("\"", "").replaceAll(";", "\"")
    }
}