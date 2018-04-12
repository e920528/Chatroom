//use express.js and socket.io
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var path = require('path');

//use static file with express
app.use(express.static(path.resolve(__dirname, 'public')));

//set port
app.set('port', process.env.PORT || 3000)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

//require css file from /css
app.use('/css', express.static('css'));
 
// number of online people
let onlineNum = 0;

// connection event
io.on('connection', (socket) => {
    // once there's a new person, increase the onlineNum
    onlineNum++;
    // send onlineNum to html page
    io.emit("online", onlineNum);

    socket.on("greet", () => {
        socket.emit("greet", onlineNum);
    });

    socket.on('disconnect', () => {
        // once there's a person disconnect, decrease onlineNum
        // Notice that min of onlineNum should be 0
        onlineNum = (onlineNum < 0) ? 0 : onlineNum-=1;
        io.emit("online", onlineNum);
    });
    socket.on("send", (msg) => {
        //if message is not null, send message to chatroom
        if(Object.keys(msg).length < 1)
            io.emit("msg", msg);
    });
});
 
server.listen(app.get('port'), () => {
    console.log("Server Started.");
});