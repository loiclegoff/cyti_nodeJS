/**
 * Created by Robin on 15/12/2017.
 */

var app= require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var database = require('./config/database');
var survey_model = require('./app/models/survey');
var question_model = require('./app/models/question');
var answer_model = require('./app/models/answer');
var fs = require('fs');

var id_sondage = mongoose.Types.ObjectId();
var id_questi = mongoose.Types.ObjectId();
var id_reponse = mongoose.Types.ObjectId();

/**
 * Connect to the db
 */


console.log("\n *STARTING* \n");
// Get content from file




fs.readFile('./answer.json', 'utf8', function (err, data)
{
    if (err) throw err; // Vous pouvez gérer les erreurs avant de parser le JSON
    var monJson = JSON.parse(data);

    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function() {
        console.log("we're connected!");
        for( var i = 0; i < monJson.length; i++ ) {
            console.log('caca');
            console.log(monJson[i]);
            new answer_model( monJson[ i ] ).save(function (err){
                if (err) { throw err; }
                mongoose.connection.close();
            });
        }
    });


});

console.log("\n *EXIT* \n");







function done(err) {
    if (err) console.error(err.stack);
    mongoose.connection.db.dropDatabase(function() {
        mongoose.connection.close();
    });
}

