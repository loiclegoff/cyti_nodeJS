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


/** Appli side
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

        const id_no = ObjectId();
        const id_yes = ObjectId();
        var answers_array = req.body.answers;
        function create_answers(answers_array){
            answers_array = req.body.answers;
            if(req.body.question_type === "YesNo"){
                var answer_yes = {
                    _id: id_yes,
                    id_question: req.body.id_question,
                    id_survey: req.body.id_survey,
                    position: 0,
                    txt: "Yes"
                };
                var answer_no = {
                    _id: id_no,
                    id_question: req.body.id_question,
                    id_survey: req.body.id_survey,
                    position: 1,
                    txt: "No"
                };
                var answers = [];
                new answer_model(answer_yes).save(function (err, answer_y) {
                    if (err) {
                        res.send(err);
                    }
                    new answer_model(answer_no).save(function (err, answer_n) {
                        if (err) {
                            res.send(err);
                        }
                        answers.push(answer_n);
                        answers.push(answer_y);
                        return answers;
                    });
                });
            }
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
        if(req.body.question_type === "YesNo"){
            ids_array.push(id_yes);
            ids_array.push(id_no);
        }
        for(var j = 0 in answers_array){
            ids_array.push(answers_array[j].id_answer);
        }
        console.log(ids_array);
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


/**Front side
 *
 * Delete a specified question from a survey
 * @param req
 * @param res
 */
exports.delete_question = function (req, res){

    console.log("req.body "+ JSON.stringify(req.body));
    console.log("req.body.id_survey : " +req.body.id_survey );
        survey_model.findByIdAndUpdate(req.body.id_survey, {
            $pull: { questions: req.body.id_question }}, {upsert:true}, function (err, survey) {
            if (err) res.status(500).send(err);
            console.log("survey :" + survey + "\n");
            console.log("id question : "+ req.body.id_question + " deleted\n");
            question_model.findByIdAndRemove(req.body.id_question,function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    answer_model.remove({ id_question: req.body.id_question, id_survey: req.body.id_survey }, function(err) {
                        if (err) {
                            res.send(err);
                        }
                        else {
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
                                    console.log(surveys);
                                }
                            });
                        }
                    });
                }
            });
        });
};
