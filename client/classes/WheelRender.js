/**
 * @import { Wheel } from '../../classes/Wheel.mjs
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
    /**
     * 
     * @param {string} text - the text you want int he wheel
     */
    createWheelSection(text){
        let wheelDiv = document.createElement('div'),
            textP = document.createElement('p')

        wheelDiv.classList.add('wheel-section')

        textP.classList.add('wheel-text')
        textP.innerText = text

        wheelDiv.append(textP)

        return wheelDiv
    }
    /**
     * 
     * @param {number[]|string[]} sectionsArray 
     */
    renderWheel(sectionsArray){
        let wheelContainerDiv = document.createElement('div'),
            wheelIndicator = this.renderIndicator()

        wheelContainerDiv.classList.add('wheel-container')

        sectionsArray.forEach(section => {
             let newDiv = this.createWheelSection(section)
             wheelContainerDiv.append(newDiv)
        })

        this.wheelElement.append(wheelContainerDiv, wheelIndicator)
    }
    renderIndicator(){
        let indicatorDiv = document.createElement('div')
        indicatorDiv.id = 'wheelIndicator'

        return indicatorDiv
    }
}