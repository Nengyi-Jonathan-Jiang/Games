const socketio = require('socket.io');

/** @param {socketio.Server} io */
module.exports = function(io){
    let n_main = io.of('/anagrams');
    let n_host = io.of('/anagrams-host');
    let n_play = io.of('/anagrams-play');

    n_main.on('make-host', data=>{
        
    })

    n_main.on('make-player', data=>{
        
    })
}