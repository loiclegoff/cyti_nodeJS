/**
 * Created by Robin on 10/01/2018.
 */
var mongoose = require('mongoose');
var database = require('../../config/database');
var question_model = require('../models/question');
var answer_model = require('../models/answer');

//sanitizes inputs against query selector injection attacks
var sanitize = require('mongo-sanitize');


/** send the list of questions of the current survey
 *
 * @param req
 * @param res
 */
exports.questions_list_with_answers = function(req, res) {
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var id_survey = sanitize(req.params.id_survey);
        question_model.find({"id_survey" : id_survey}, function (err, questions) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
                res.status(500).send(err);
            } else {
                for (var i = 0 in questions ){
                    var id_question = [];
                    id_question = questions[i]._id;
                    var answerArray = "answerArray";
                    var answer = answer_model.find({"id_question" : id_question}, { id_question: 0, id_survey: 0, __v: 0 }, function (err, answers) {
                        if (err) {
                            // Note that this error doesn't mean nothing was found,
                            // it means the database had an e
                            //error while searching, hence the 500 status
                            res.status(500).send(err);
                        } else {
                            res.send('coucou');
                        }
                    });
                }
            }
        });
    });
};


/** Create new question with its answers in collections question & answer
 *
 * @param req
 * @param res
 */
exports.add_question_with_answers = function(req, res){
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var id_user = sanitize(req.body.id_user);
        var question = {
            id_survey: sanitize(req.body.id_survey),
            position: sanitize(req.body.question_position),
            txt: sanitize(req.body.question_txt),
            type: sanitize(req.body.question_type),
            mandatory: sanitize(req.body.mandatory)
        };
        console.log(question);
        new question_model(question).save(function (err, question) {
            if (err) {
                throw err;
            }
            var id_survey = req.body.id_survey;
            var id_question = question._id;
            for (var i in req.body.answers){
                var answer={
                    id_question: id_question,
                    id_survey: id_survey,
                    position: req.body.answers[i].answer_position,
                    txt: req.body.answers[i].answer_txt
                };
                console.log(answer);
                new answer_model(answer).save(function (err) {
                    if (err) {
                        throw err;
                    }
                    mongoose.connection.close();
                });
            }
        });
    });
    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });
};

exports.update_question_with_answers = function(req, res){
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var id_question = req.body.id_question;
    });

    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });
};
