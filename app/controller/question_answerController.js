/**
 * Created by Robin on 10/01/2018.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var database = require('../../config/database');
var survey_model = require('../models/survey');
var question_model = require('../models/question');
var answer_model = require('../models/answer');

//sanitizes inputs against query selector injection attacks
var sanitize = require('mongo-sanitize');


/** APPLI
 * send the list of questions of the current survey
 * Working
 * @param req
 * @param res
 */
exports.list_questions_with_answers = function(req, res) {

        var id_survey = req.params.id_survey;
        question_model.find({"id_survey": id_survey}).populate({path:"answers",
            model:"answer"}).exec(function (err, questions) {
            if (err)res.status(500).send(err);
            else{
                res.json(questions);
            }
        });
};


/** Front Side
 *
 * Add a new question with its respective answers
 * @param req
 * @param res
 */
exports.add_question_with_answers = function(req, res ){

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
                        res.send(err);
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
        var answers = create_answers(answers_array);
        new question_model(question).save(function (err, question) {
            if (err) {
                res.send(err);
            }
            survey_model.findByIdAndUpdate(req.body.id_survey, {
                $push: { questions: question._id }}, {upsert:true}, function (err) {
                if (err) res.status(500).send(err);
                else {
                    survey_model.find({}).populate({
                        path: "questions", model: "question", populate: {
                            path: 'answers',
                            model: 'answer'
                        }
                    }).exec(function (err, surveys) {
                        if(err) res.send(err);
                        else{
                            res.json(surveys);
                        }
                    });
                }
            });
        });
};


/** FRONT
 *
 * @param req
 * @param res
 */
exports.update_question_with_answers = function(req, res){
    var db = mongoose.connection;

        mongoose.connect(database.url);
        db.on('error', console.error.bind(console, 'connection error:'));
        db.on('open', function () {
            console.log("we're connected! update_question_with_answers");
            console.log("******\n");
        var id_question = req.body.id_question;
    });

    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });
};

/**Front side
 *
 * Delete a specified question from a survey
 * @param req
 * @param res
 */
exports.delete_question = function (req, res){

        survey_model.findByIdAndUpdate(req.body.id_survey, {
            $pull: { questions: req.body.id_question }}, {upsert:true}, function (err) {
            if (err) res.status(500).send(err);
            console.log("id question : "+ req.body.id_question + " deleted\n");
            question_model.findByIdAndRemove(req.body.id_question,function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    survey_model.find({}).populate({
                        path: "questions", model: "question", populate: {
                            path: 'answers',
                            model: 'answer'
                        }
                    }).exec(function (err, surveys) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.json(surveys);
                        }
                    });
                }
            });
        });

};
