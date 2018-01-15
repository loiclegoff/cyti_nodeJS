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

// define the home page of app/ route
router.get('/', survey_controller.list_surveys_online);

// define the /:id_survey page of app/ route
router.get('/:id_survey', question_controller.list_questions_with_answers);

module.exports = router;
