var express = require('express');
var http = require("http");
var mongoose = require('mongoose');
var CONFIG = require("./config.json");
var database = require('./config/database');
process.env.CONFIG = JSON.stringify(CONFIG);
var main = require('./app/routes/main');
var app_mobile= require ('./app/routes/app_mobile');
var cadeaux= require ('./app/routes/cadeaux');
var profil= require ('./app/routes/profil');
var survey_controller = require('./app/controller/surveyController');
var question_controller = require('./app/controller/question_answerController');

var app = express();

var db = mongoose.connection;
mongoose.connect(database.url, { useMongoClient: true});
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function () {
    console.log("we're connected! ");
    console.log("******\n");
});
// When the connection is disconnected
db.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

app.use('/', main);
app.use('/app', app_mobile);
app.use('/cadeaux', cadeaux);
app.use('/profil', profil);

// define the home page of app/ route
app.route('/app').get(survey_controller.list_surveys_online);

// define the /:id_survey page of app/ route
app.route('/:id_survey').get(question_controller.list_questions_with_answers);

// init server
var server = http.createServer(app);
server.listen(CONFIG.port,  function(){
    console.log(`Listening at port ${CONFIG.port}`);


    
});






