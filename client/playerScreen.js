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

    

