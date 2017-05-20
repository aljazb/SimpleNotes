var express = require('express');
var app = express();

var port = process.env.PORT || 8042;

var speech = require('./app/speech');





app.get('/record', speech.snemaj);
app.get('/stop', speech.ustavi);






app.listen(port);
console.log('Čarovnija se zgodi na vratih ' + port);