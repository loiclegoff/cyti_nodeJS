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
router.post('/', function(req, res) {
    console.log(req.body); //upload json file
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var survey = {
            title: req.body.title,
            description: req.body.description,
            survey_type: req.body.survey_type,
            theme: req.body.theme,
            status: "offline",
            duration: ""
        };
        new survey_model(survey).save(function (err, survey) {
            if (err) {
                throw err;
            }
            var id_survey = survey._id;
            //we get the Object_ID of the current survey
            survey_model.find({"_id": id_survey},function(err, survey){
                if (err) {
                    // Note that this error doesn't mean nothing was found,
                    // it means the database had an error while searching, hence the 500 status
                    res.status(500).send(err);
                } else {
                    // send the list of all people
                    res.status(200).send(survey[0]);
                    mongoose.connection.close();
        }

        });

        });
    });
    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });
});

// define the about route
router.post('/add_question', function(req, res) {
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var id_user = req.body.id_user;
        var question = {
            id_survey: req.body.id_survey,
            position: req.body.question_position,
            txt: req.body.question_txt,
            type: req.body.question_type,
            mandatory: req.body.mandatory
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
                });
            }
        });
    });
});

module.exports = router;
