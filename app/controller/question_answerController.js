/**
 * Created by Robin on 10/01/2018.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
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
exports.list_questions_with_answers = function(req, res, next) {
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var id_survey = sanitize(req.params.id_survey);
        question_model.find({"id_survey": id_survey}).populate({path:"answers",
            model:"answer"}).exec(function (err, questions) {
            if (err) return next(err);//res.status(500).send(err);
            //res.json(questions);
            res.end(JSON.stringify(questions));
            mongoose.connection.close();
        });
    });
    // When the connection is disconnected
    db.on('disconnected', function () {


        console.log('Mongoose default connection disconnected');
    });

};

exports.add_question_with_answers = function(req, res){
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var answers_array = req.body.answers;
        function create_answers(answers_array){
            answers_array = req.body.answers;
            for (var i = 0 in answers_array) {
                var answer = {
                    _id: ObjectId(answers_array[i].id_answer),
                    id_question: req.body.id_question,
                    id_survey: req.body.id_survey,
                    position: answers_array[i].answer_position,
                    txt: answers_array[i].answer_txt
                };
                new answer_model(answer).save(function (err, answer) {
                    if (err) {
                        throw err;
                    }
                    return answer;
                });
            }
        }
        var ids_array = [];
        for(var j = 0 in answers_array){
            ids_array.push(answers_array[j].id_answer);
        }
        var question = {
            _id: ObjectId(req.body.id_question),
            id_survey: req.body.id_survey,
            position: req.body.question_position,
            txt: sanitize(req.body.question_txt),
            type: req.body.question_type,
            mandatory: req.body.mandatory,
            answers: ids_array
        };
        console.log(question);
        var answers = create_answers(answers_array);
        console.log(answers);
        new question_model(question).save(function (err) {
            if (err) {
                throw err;
            }
            mongoose.connection.close();

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
