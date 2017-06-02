const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(3000, console.log('Server is running...'));

const arrUser = [];
io.on('connection', socket => {
    socket.on('REGIST_USER', username => {
        const isExist = arrUser.indexOf(username);
        if (isExist) return socket.emit('CONFIRM_USER', false);
        
        socket.username = username;
        arrUser.push(username);

        socket.emit('CONFIRM_USER', true);
        socket.emit('USER_LIST', arrUser);
        socket.broadcast.emit('NEW_USER', username);
    });

    socket.on('disconnect', ()=>{
        if(!socket.username) return;
        io.emit('DISCONNECT_USER', socket.username);
        const index = arrUser.indexOf(socket.username);
        arrUser.splice(index, 1);
    });
});
