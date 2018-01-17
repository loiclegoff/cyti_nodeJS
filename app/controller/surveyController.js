/**
 * Created by Robin on 10/01/2018.
 */

var mongoose = require('mongoose');
var database = require('../../config/database');
var survey_model = require('../models/survey');

//sanitizes inputs against query selector injection attacks
var sanitize = require('mongo-sanitize');


exports.list_all = function(req, res){
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        survey_model.find({}).populate({path: "questions", model: "question", populate: { path: 'answers',
            model: 'answer'}}).exec(function (err, surveys) {
            res.end(JSON.stringify(surveys));
            mongoose.connection.close();
        });
    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });
});

};

/** FRONT
 * Create a new survey in survey collection
 *
 * @param req
 * @param res
 */
exports.new_survey = function(req, res, next) {
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var survey = {
            _id: req.body.id_survey,
            title: sanitize(req.body.title),
            description: sanitize(req.body.description),
            survey_type: sanitize(req.body.survey_type),
            theme: sanitize(req.body.theme),
            status: "offline",
            duration: ""
        };
        new survey_model(survey).save(function (err) {
            if (err) {
                throw err;
            }
            survey_model.find({}).populate({path: "questions", model: "question", populate: { path: 'answers',
                model: 'answer'}}).exec(function (err, surveys) {
                    res.end(JSON.stringify(surveys));
                    mongoose.connection.close();
                });
            });
        });
    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });
};

/** Front side
 *
 * Update status survey in DB
 *
 * @param req
 * @param res
 */
exports.change_status_survey = function(req, res, next){
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        survey_model.findById(req.body.id_survey,function(err, survey) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
                return next(err);
                //res.status(500).send(err);
            } else {
                if(survey.status === "offline") survey.status = "online";
                else survey.status = "offline";
                survey.save( function(err){
                    if (err) {
                        return next(err);
                    }
                    survey_model.find({}).populate({path: "questions", model: "question", populate: { path: 'answers',
                        model: 'answer'}}).exec(function (err, surveys) {
                        res.end(JSON.stringify(surveys));
                        mongoose.connection.close();
                    });
                });
            }
        });
    });
    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });
};

/** Application side
 *
 * List all surveys which are online
 *
 * @param req
 * @param res
 * @param next
 */
exports.list_surveys_online = function(req, res, next){
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        console.log("ici on passe");
        survey_model.find({"status": "online"}, function (err, survey) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
                return next(err);
            }
                mongoose.connection.close();
                res.end(JSON.stringify(survey));

        });
    });
    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });
};

/** Front side
 *
 * Delete a specified survey from its ID in BD
 * @param req
 * @param res
 * @param next
 */
exports.delete_survey = function(req, res, next){
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        survey_model.findByIdAndRemove(req.body.id_survey,function(err) {
            if (err) {
                return next(err);
            } else {
                survey_model.find({}).populate({
                    path: "questions", model: "question", populate: {
                        path: 'answers',
                        model: 'answer'
                    }
                }).exec(function (err, surveys) {
                    res.end(JSON.stringify(surveys));
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

