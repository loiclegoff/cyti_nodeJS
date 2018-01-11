var express = require('express');
var http = require("http");
var mongoose = require('mongoose');
var CONFIG = require("./config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
const QuestionModel = require('./app/models/survey');
const AnswersUserModel = require('./app/models/schema_answers_user');
const UserModel = require('./app/models/schema_user');
var main = require('./app/routes/main');
var app_mobile= require ('./app/routes/app_mobile');
var app = express();

app.get('/', function(req, res){
    res.send("Hello cyti !!");
});

app.use('/', main);
app.use('/app', app_mobile);


// init server
var server = http.createServer(app);
server.listen(CONFIG.port,  function(){
    console.log(`Listening at port ${CONFIG.port}`);
});






