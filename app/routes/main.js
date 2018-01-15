/**
 * Created by Robin on 08/01/2018.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var survey_controller = require('../controller/surveyController');
var question_answer_controller = require('../controller/question_answerController');


//Body parser
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());



// ## CORS middleware
//
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
router.use(allowCrossDomain);

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// Add a new survey
router.post('/', survey_controller.new_survey);

//List all surveys with questions and answers for a specific user
router.get('/', survey_controller.list_all);

// Add a new question with its respective answers
router.post('/survey/add_question',question_answer_controller.add_question_with_answers);

//Update the status of a targeted survey
router.post('/survey/change_status', survey_controller.change_status_survey);

//Delete a targeted survey
router.delete('/survey/delete', survey_controller.delete_survey);

router.delete('/survey/delete_question', question_answer_controller.delete_question);

module.exports = router;
