class Wheel{
    constructor(sections = []){
        this.sections = sections
        this.sectionWidthInDeg = 0
        this.currentDeg = 0
        this.minValue = 3
        this.maxValue = 9
        this.speedPowerFactor = 14 //7.2 is roughly the factor to get a 50 power spin to go 360 degrees, if i did the math correct (360/50)
        this.generateSections()
    }
    /**
     * 
     * @param {number} bonusValue the one big bonus space value, it increases each round in the game.
     * @param {number} numberOfSections number of sections in the wheel, defaults to 24
     */
    generateSections(bonusValue = 1000, numberOfSections = 24){
        let sectionValues = [],
            specialSpaces = 4,
            requiredNumbers = numberOfSections - specialSpaces
        for (let index = 0; index < requiredNumbers; index++) {
            sectionValues.push(this.getRandomValue(this.minValue, this.maxValue))
        }
        sectionValues.push(bonusValue, 'bankrupt', 'lose a turn', 'lose a turn')
        this.sections = sectionValues
        this.shuffleSections()
        this.sectionWidthInDeg = 360 / this.sections.length
    }
    getRandomValue(min, max){
        return (Math.floor(Math.random() * (max - min + 1)) + min) * 100
    }
    coinFlip(){
        return Math.random() < .5
    }
    shuffleSections(){
            for (let i = this.sections.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = this.sections[i]
            this.sections[i] = this.sections[j]
            this.sections[j] = temp
        }
    }
    calcRandomNudge(baseNum){
        let nudgeValue = baseNum * (1 + Math.random())
        if (this.coinFlip()){
            return nudgeValue
        } else {
            return nudgeValue * -1
        }
    }
    calcWheelSpinPowerInDegrees(speedFromPhone){
        // .6 is a stdv of about 8.5 over 10000 spins, which is like +/- one half section
        return Math.round((speedFromPhone * this.speedPowerFactor) + (this.calcRandomNudge(speedFromPhone))) 
    }
    resetCurrentDeg(){
        while (this.currentDeg > 360){
            this.currentDeg -= 360
        }
        return this.currentDeg
    }
    spinWheel(speedFromPhone){
        let rotation = this.calcWheelSpinPowerInDegrees(speedFromPhone)
        this.currentDeg += rotation
        this.resetCurrentDeg()
        return rotation
    }
    /**
     * 
     * @returns {number} returns 0 if it's not a scoring space, just in case.
     */
    getWheelValue(){
        let reading = this.sections[Math.floor(this.currentDeg/this.sectionWidthInDeg)]
        // console.log("reading:", reading, Math.floor(this.currentDeg/this.sectionWidthInDeg))
        return !Number.isNaN(reading)? reading : 0
    }
}

module.exports = { Wheel }