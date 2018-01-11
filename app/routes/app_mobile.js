/**
 * Created by Robin on 10/01/2018.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var question_controller = require('../controller/question_answerController');
var survey_controller = require('../controller/surveyController');

//Body parser
router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

// define the home page of app/ route
router.get('/', survey_controller.list_surveys_online);

// define the /:id_survey page of app/ route
router.get('/:id_survey', question_controller.questions_list_with_answers);

module.exports = router;
