export default class PowerBar{
    /**
     * 
     * @param {HTMLElement} anchorContainer
     * @param {string} id 
     */
    constructor(anchorContainer, id='powerBar'){
        this.container = anchorContainer,
        this.powerBarEl = this.createBar(id),
        this.lastScrollY = this.container.scrollTop,
        this.lastTime = Date.now(),
        this.scrollSpeed = 0,
        this.scrollSpeedToSend = 0
        this.scrollRecorder = 0
    }
    createBar(id){
        let powerBar = document.createElement('div')
        powerBar.id = id
        this.container.append(powerBar)
        return powerBar
    }
    resizeBarHeight(containerRatio = .95, barRatio = 2){
        let viewportHeight = window.innerHeight,
            containerHeight = Math.round(viewportHeight * containerRatio),
            barTotalHeight = Math.round(containerHeight * barRatio)

        this.container.style.height = `${containerHeight}px`
        this.powerBarEl.style.height = `${barTotalHeight}px`

        return [this.container.style.height, this.powerBarEl.style.height]
    }
    setBackgroundGradient(){
        let containerHeight = this.container.style.height,
            blackRatio = Math.round((containerHeight/barTotalHeight)*100),
            colorFactor = Math.round((100 - blackRatio)/3)

            this.powerBarEl.style.background = `linear-gradient(black, black ${blackRatio}%, green ${blackRatio+colorFactor}%,yellow ${blackRatio+colorFactor*2}%, red 100%)`
    }
    calculateScrollSpeedInterval(){
        const currentScrollY = this.container.scrollTop,
            currentTime = Date.now(),
            scrollDelta = currentScrollY - this.lastScrollY,
            timeDelta = currentTime - this.lastTime

        if (timeDelta > 0){ // Avoid division by zero
        this.scrollSpeed = scrollDelta / timeDelta // Pixels per millisecond
        } else {
        this.scrollSpeed = 0
        }

        this.lastScrollY = currentScrollY
        this.lastTime = currentTime

        if (scrollSpeed !== 0){
            console.log("Scroll Speed:", this.scrollSpeed, "pixels/ms")
        }

        if (this.scrollSpeed !==0 && this.scrollSpeed > this.scrollSpeedToSend){
        this.scrollSpeedToSend = this.scrollSpeed
        }
    }
    startScrollCalculations(){
        this.scrollSpeedToSend = 0
        this.scrollRecorder = setInterval(this.calculateScrollSpeedInterval, 1)
    }
    stopScrollCalculations(){
        clearInterval(this.scrollRecorder)
        this.container.scroll({top: 0, behavior:"smooth"})
        return this.scrollSpeedToSend
    }
}