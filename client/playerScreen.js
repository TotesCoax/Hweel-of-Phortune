console.log('File Loaded')

const socket = io({transports: ['websocket', 'polling', 'flashsocket']})

socket.on("connect", () => {
    console.log(socket.id)
})

const scrollPowerContainer = document.getElementById("scrollPowerContainer")

scrollPowerContainer.addEventListener("touchstart", startScrollCalculations)

scrollPowerContainer.addEventListener("touchend", stopScrollCalculations)

// On/Off for calc function example
function startScrollCalculations() {
  scrollSpeedToSend = 0
  scrollRecorder = setInterval(calculateScrollSpeedInterval, 1)
}

function stopScrollCalculations() {
  clearInterval(scrollRecorder)
  console.log(scrollSpeedToSend)
  document.querySelector("#speedData").innerText = scrollSpeedToSend
  scrollPowerContainer.scroll({top: 0, behavior: "smooth"})
  socket.emit("speedData", scrollSpeedToSend)
}

// Scroll Speed Calc Functions
let lastScrollY = scrollPowerContainer.scrollTop,
  lastTime = Date.now(),
  scrollSpeed = 0,
  scrollRecorder,
  scrollSpeedToSend = 0

function calculateScrollSpeedInterval(){
  const currentScrollY = scrollPowerContainer.scrollTop,
    currentTime = Date.now(),
    scrollDelta = currentScrollY - lastScrollY,
    timeDelta = currentTime - lastTime

    if (timeDelta > 0){ // Avoid division by zero
      scrollSpeed = scrollDelta / timeDelta // Pixels per millisecond
    } else {
      scrollSpeed = 0
    }

    lastScrollY = currentScrollY
    lastTime = currentTime

    if (scrollSpeed !== 0){
        console.log("Scroll Speed:", scrollSpeed, "pixels/ms")
    }

    if (scrollSpeed !==0 && scrollSpeed > scrollSpeedToSend){
      scrollSpeedToSend = scrollSpeed
    }
}

// Scroll Meter Sizing
function resizePowerBar(){
  let powerBar = document.getElementById("powerBar"),
      viewportHeight = window.innerHeight,
      containerHeight = Math.round(viewportHeight * .9),
      barTotalHeight = Math.round(containerHeight * 2.0),
      blackRatio = Math.round((containerHeight/barTotalHeight)*100),
      colorFactor = Math.round((100 - blackRatio)/3)

  console.log(containerHeight, barTotalHeight, blackRatio, colorFactor)

  scrollPowerContainer.style.height = `${containerHeight}px`
  powerBar.style.height = `${barTotalHeight}px`

  powerBar.style.background = `linear-gradient(black, black ${blackRatio}%, green ${blackRatio+colorFactor}%,yellow ${blackRatio+colorFactor*2}%, red 100%)`
  
  return [scrollPowerContainer.style.height, powerBar.style.height]
}

resizePowerBar()
