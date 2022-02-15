module.exports = function(server){
    const socketio = require("socket.io");

    /** @type {socketio.Server} */
    const io = require("socket.io")(server);

    io.on("connection", socket=>{
        let url = socket.request.url;
        console.log(url);
        
    })

    class GameSocket{
        /** @param {WebSocket} */
        constructor(){

        }
    }

    class Room{

    }

    class SocketWrapper{

    }
}