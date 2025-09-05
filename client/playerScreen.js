console.log('File Loaded')

/**
 * @typedef {object} PlayerInfo
 * @property {string} id - id from the server
 * @property {string} name - user selected name
 * @property {number} score - score for the game
 * @property {string} color - hex code of player color
 */
let playerInfo = {
  id: 'new',
  name: '',
  score: '',
  color: ''
}

function updateLocalStorage(){
  let value = JSON.stringify(playerInfo)
  window.localStorage.setItem('playerInfo', value)
}

/**
 * 
 * @returns {PlayerInfo} - parse player info from localStorage
 */
function getPlayerDataFromLocal(){
  let playerString = window.localStorage.getItem('playerInfo')
  return JSON.parse(playerString)
}

const socket = io({transports: ['websocket', 'polling', 'flashsocket']})

socket.on("connect", () => {
    console.log(socket.id)
    let playerID = window.localStorage.getItem('playerInfo') ? getPlayerDataFromLocal().id : ''
    socket.emit('playerJoin', playerID, (res) => {
      console.log(res)
      playerInfo = res
      updateLocalStorage()
    })
})

// Power Bar shit

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
      containerHeight = Math.round(viewportHeight * .95),
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


// Menu Stuff

const menuDisplay = document.getElementById('menuDisplay'),
      menuContent = document.getElementById('menuContent'),
      leftArrow = document.getElementById('leftArrow'),
      rightArrow = document.getElementById('rightArrow'),
      nameInput = document.getElementById('nameInput'),
      colorInput = document.getElementById('colorInput')

menuDisplay.addEventListener('click', (event) => {
  console.log(event.target, event.target.closest('#menuContent > *'))
  if (event.target.closest('#menuContent > *')){
    return
  }
  menuContent.classList.toggle('hidden')
  leftArrow.classList.toggle('hidden')
  rightArrow.classList.toggle('hidden')
})

nameInput.addEventListener('input', () => {
  socket.emit('nameChange', {id: playerInfo.id, name: nameInput.value})
})

colorInput.addEventListener('input', () => {
  socket.emit('colorChange', {id: playerInfo.id, color: colorInput.value})
})

