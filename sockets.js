module.exports = function(server){
    const socketio = require("socket.io");
    /** @type {socketio.Server} */
    const io = require("socket.io")(server);

    io.on("connection", socket=>{
        let url = socket.request.url;
        console.log(url);
    })

    class Game{
        /** @param {string} name @param {(namespace:socketio.Namespace)=>any} run*/
        constructor(name, run){
            run(io.of(name));
        }
    }

    class Room{
        static id = 0;
        /** @param {socketio.Namespace} space */
        constructor(space){
            this.name = space.name + (++id);
        }
    }

    class SocketWrapper{
        /** @param {socketio.Socket} socket */
        constructor(socket){
            this.socket = socket;
        }
        /** @param {string} evt @param {Object} data */
        emit(evt, data){
            this.socket.emit(evt, JSON.stringify(data));
        }
    }
}