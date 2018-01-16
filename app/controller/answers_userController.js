/**
 * Created by Robin on 16/01/2018.
 */

var answer_user_model = require('../models/schema_answers_user');
var mongoose = require('mongoose');



exports.new_answer_user = function(req, res) {

        var answer = {
            id_user: req.body.id_contact,
            id_survey: req.params.id_survey,
            id_question: req.body.id_question,
            id_answer: req.body.id_reponse
        };
        console.log(answer);
        new answer_user_model(answer).save(function (err) {
            if (err) res.send(err);
            else{
                res.send("answer user saved");
            }
        });

};