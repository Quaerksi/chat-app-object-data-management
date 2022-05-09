"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
require('dotenv').config();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use(express_1.default.urlencoded({ extended: false }));
app.set('views', './views');
app.set('view engine', 'ejs');
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
let users = {};
let rooms = ['garden', 'water'];
app.get('/', (req, res) => {
    res.render('welcome');
});
app.get('/index/user/:user', (req, res) => {
    if (users[req.params.user] == null) {
        return res.redirect('/');
    }
    res.render('index', { rooms: rooms, user: req.params.user });
});
app.post('/index', (req, res) => {
    if (users[req.body.newUser] != null) {
        return res.redirect('/');
    }
    users[req.body.newUser] = {};
    io.emit('user names', Object.keys(users));
    return res.render('index', { rooms: rooms, user: req.body.newUser });
});
app.get('/room/:room/user/:user', (req, res) => {
    if (users[req.params.user] == null || !rooms.includes(req.params.room)) {
        return res.redirect('/');
    }
    return res.render('room', { room: req.params.room, user: req.params.user });
});
//has to be fixed create room
app.post('/room/:room/user/:user', (req, res) => {
    //  console.log(`Room ${req.body.roomName}, User ${req.body.roomUser}`)
    if (rooms.includes(req.body.roomName)) {
        // return res.redirect('/index');
        return res.render('index', { rooms: rooms, user: req.body.roomUser });
    }
    rooms.push(req.body.roomName);
    res.render('room', { room: req.body.roomName, user: req.body.roomUser });
    io.emit('new room created', req.body.roomName);
});
//  ***********************function*************************************************************************
let usersInRoom = (room) => {
    let usersInRoom = [];
    Object.keys(users).forEach(name => {
        if (typeof users[name][room] !== 'undefined') {
            usersInRoom.push(name);
        }
    });
    // console.log(`Who is online: ${usersInRoom.toString()}`)
    return usersInRoom;
};
//  ***********************io*************************************************************************
io.on('connection', (socket) => {
    //socket disconnect
    socket.on('disconnect', () => {
        let index2;
        let index1 = Object.values(users).findIndex((object) => {
            //find right entry -> SocketId for room
            let find = Object.values(object).find((mySocket, i, arr) => {
                // console.log(`MySocket: ${JSON.stringify(Object.keys(mySocket))}, ${mySocket['id']}`);
                if (mySocket['id'] == socket.id) {
                    index2 = i;
                    return true;
                }
                else {
                    return false;
                }
            });
            return find == null ? false : true;
        });
        // console.log(`Disconnect: index1 = ${index1}, index2 = ${index2}`);
        //if socket disconnect is from a chat room, then delete entry and send message to the remaining chat members
        if (typeof Object.values(users)[index1] !== 'undefined') {
            const name = Object.keys(users)[index1];
            if (typeof Object.values(users[name])[index2] !== 'undefined') {
                const room = Object.keys(users[name])[index2];
                socket.to(room).emit('chat message', `${name} left`);
                socket.leave(socket);
                // console.log(`Leave  ${room}, ${name}`)
                delete users[name][room];
            }
            else {
                console.log(`Error in index2`);
            }
        }
        else {
            console.log(`Error in index1`);
        }
    });
    //handle new user connections
    socket.on('new chat member', (room, user) => {
        //if user enters a chat second time
        if (typeof users[user][room] !== 'undefined') {
            socket.to(room).emit('chat message', `${user} left`);
            users[user][room].emit('chat message', `${user} connected again. You got disconnected`);
            //leave with old socket
            users[user][room].leave(room);
        }
        //enter with new socket
        users[user][room] = socket;
        socket.join(room);
        // console.log(`Join ${room}, ${user}`)
        //send message to chat members
        socket.to(room).emit('chat message', `${user} has joined`);
        //who is online, send to socket
        let usersInRoomOnline = usersInRoom(room);
        usersInRoomOnline.length > 1
            ? socket.emit('chat message', `Online: ${usersInRoom(room).filter(name => name != user).toString()}`)
            : socket.emit('chat message', `You are alone`);
    });
    socket.on('send user names', () => {
        socket.emit('user names', Object.keys(users));
    });
    //broadcast messages  
    socket.on('chat message', (room, user, msg) => {
        socket.to(room).emit('chat message', `${user}: ${msg}`);
    });
});
server.listen(port, () => {
    console.log('listening on *:3000');
});
