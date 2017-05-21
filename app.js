var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 8042;

var speech = require('./app/speech');


app.get('/record/*', speech.snemaj);
app.get('/stop', speech.ustavi);

io.on('connection', speech.socketConnection);
io.on('message', speech.socketMessage);



app.use(express.static('stran'));

server.listen(2017);
app.listen(port);
console.log('Čarovnija se zgodi na vratih ' + port);