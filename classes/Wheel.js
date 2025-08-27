class Wheel{
    constructor(){
        this.sections = []
        this.minValue = 3
        this.maxValue = 9
    }
    generateSections(numberOfSections, bonusValue){
        let sectionValues = [],
            specialSpaces = 4,
            requiredNumbers = numberOfSections - specialSpaces
        for (let index = 0; index < requiredNumbers; index++) {
            sectionValues.push(this.getRandomValue())
        }
        sectionValues.push[bonusValue, 'bankrupt', 'lose a turn', 'lose a turn']
        this.sections = sectionValues
    }
    getRandomValue(){
        return (Math.floor(Math.random() * (this.maxValue - this.minValue + 1)) + this.minValue) * 100
    }
    shuffleSections(){
            for (let i = this.sections.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = this.players[i]
            this.sections[i] = this.players[j]
            this.sections[j] = temp
        }
    }
}