/**
 * @import { Wheel } from '../../classes/Wheel.mjs
 */

/**
 * A Class to assist with rendering a circular wheel.
 */
export class WheelRender {
    /**
     * 
     * @param {string} containerHook 
     */
    constructor(containerHook){
        /**
         * @type {HTMLDivElement}
         */
        this.wheelElement = document.getElementById(containerHook)
    }
    clearChildren(){
        while (this.wheelElement.firstChild){
            this.wheelElement.lastChild.remove()
        }
    }
    /**
     * 
     * @param {string} text - the text you want in the wheel section
     */
    createWheelSection(text){
        let wheelDiv = document.createElement('div'),
            textP = document.createElement('p')

        wheelDiv.classList.add('wheel-section')

        textP.classList.add('wheel-text')
        textP.innerText = text
        textP.innerText = textP.innerText.toUpperCase()

        wheelDiv.append(textP)

        return wheelDiv
    }
    /**
     * 
     * @param {Wheel} wheelObj - wheel object
     */
    renderWheel(wheelObj){
        this.clearChildren()
        // let wheelContainerDiv = document.createElement('div')

        // wheelContainerDiv.id = 'wheelContainer'

        wheelObj.sections.forEach(section => {
             let newDiv = this.createWheelSection(section)
             this.wheelElement.append(newDiv)
        })

        this.wheelElement.style.rotate = `-${wheelObj.currentDeg}deg`

        // this.wheelElement.append(wheelContainerDiv)
        this.arrangeWheelSections()
    }
    arrangeWheelSections(){
        let sections = document.querySelectorAll('.wheel-section'),
            degreeIncrement = 0,
            degreeStep = 360 / sections.length

        sections.forEach(section => {
            section.style.rotate = `${degreeIncrement * degreeStep}deg`
            degreeIncrement++
        })
    }
}