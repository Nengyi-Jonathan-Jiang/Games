// // sending to sender only
// socket.emit("message", "value");

// // sending to all clients, including sender
// io.emit("message", "value");

// // sending to all clients except sender
// socket.broadcast.emit("message", "value");

// // sending to all clients in room except sender
// socket.broadcast.to("ROOM").emit("message", "value");

// // sending to all clients in room including sender
// io.to("ROOM").emit("message", "value");

// // sending to sender only if they are in the room
// socket.to("ROOM").emit("message", "value");

// // sending to individual Socket ID
// socket.broadcast.to("SOCKETID").emit("message", "value");
