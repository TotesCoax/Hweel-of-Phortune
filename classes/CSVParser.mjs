export class CSVParser {
    constructor(){
        this.pathToFile
    }
    /**
     * 
     * @param {string} csv 
     * @returns {string[]}
     */
    static csvToArray(csv){
        return csv.split('\r\n').map( line => {
            return this.parseOnCommas(line)
        })
    }
    /**
     * 
     * @param {string} line 
     * @returns {string[]} - parsed string
     */
    static parseOnCommas(line){
        return line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
    }
    /**
     * 
     * @param {string} string 
     * @returns {string}
     */
    static cleanUpOuterQuotes(string){
        return string.replaceAll("\"\"", ";").replaceAll("\"", "").replaceAll(";", "\"")
    }
}