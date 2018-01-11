/**
 * Created by Robin on 08/01/2018.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var database = require('../../config/database');
var survey_model = require('../../app/models/survey');
var question_model = require('../../app/models/question');
var answer_model = require('../../app/models/answer');
var survey_controller = require('../controller/surveyController');
var question_answer_controller = require('../controller/question_answerController');


//Body parser
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());



// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// define the home page route
router.post('/', survey_controller.new_survey);

// define the add_question route
router.post('/add_question',question_answer_controller.add_question_with_answers);

router.post('/change_status', survey_controller.change_status_survey);

module.exports = router;
