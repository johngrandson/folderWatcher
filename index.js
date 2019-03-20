var SocketIOFileUpload = require('socketio-file-upload'),
    socketio = require('socket.io'),
    express = require('express');

// Make your Express server:
var app = express()
    .use(SocketIOFileUpload.router)
    .use(express.static(__dirname + "/public"))
    .listen(3000);

const fs = require('fs')

const folderName = 'D:/Coding/newFolder'

// Start up Socket.IO:
var io = socketio.listen(app);
io.sockets.on("connection", function(socket){
    console.log('connected');

    try {
        if (!fs.existsSync(folderName)){
            const res = fs.mkdirSync(folderName);
            console.log('res :', res);
        }
    } catch (err) {
        console.error(err)
    }

    fs.watch(folderName, (event, filename) => {
        console.log('event :', event);
        console.log('filename :', filename);
    });

    // Make an instance of SocketIOFileUpload and listen on this socket:
    var uploader = new SocketIOFileUpload();

    uploader.dir = "D:/Coding/newFolder/";
    uploader.listen(socket);

    // Do something when a file is saved:
    uploader.on("saved", function(event){
        console.log('file saved', event.file);
    });

    // Error handler:
    uploader.on("error", function(event){
        console.log("Error from uploader", event);
    });
});