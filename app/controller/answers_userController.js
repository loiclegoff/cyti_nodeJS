/**
 * Created by Robin on 16/01/2018.
 */

var answer_user_model = require('../models/schema_answers_user');
var mongoose = require('mongoose');
var database = require('../../config/database');


exports.new_answer_user = function(req, res, next) {
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var answer = {
            id_user: req.body.id_contact,
            id_survey: req.params.id_survey,
            id_question: req.body.id_question,
            id_answer: req.body.id_reponse
        };
        console.log(answer);
        new answer_user_model(answer).save(function (err) {
            if (err) return next(err);
            else{
                res.end("answer user saved");
                mongoose.connection.close();
            }
        });
    });
    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });
};