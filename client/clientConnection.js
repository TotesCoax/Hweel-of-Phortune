console.log('Connection File loaded')

const socket = io("http://localhost:3000", {transports: ['websocket', 'polling', 'flashsocket']})

socket.on("connect", () => {
    console.log(socket.id)
})