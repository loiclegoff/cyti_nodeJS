/**
 * Created by Robin on 10/01/2018.
 */

var mongoose = require('mongoose');
var database = require('../../config/database');
var survey_model = require('../models/survey');

//sanitizes inputs against query selector injection attacks
var sanitize = require('mongo-sanitize');


/** Create a new survey in survey collection
 *
 * @param req
 * @param res
 */
exports.new_survey = function(req, res) {
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var survey = {
            title: sanitize(req.body.title),
            description: sanitize(req.body.description),
            survey_type: sanitize(req.body.survey_type),
            theme: sanitize(req.body.theme),
            status: "offline",
            duration: ""
        };
        new survey_model(survey).save(function (err, survey) {
            if (err) {
                throw err;
            }
            var id_survey = survey._id;
            //we get the Object_ID of the current survey
            survey_model.findById(id_survey,function(err, survey){
                if (err) {
                    // Note that this error doesn't mean nothing was found,
                    // it means the database had an error while searching, hence the 500 status
                    res.status(500).send(err);
                } else {
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
};

/** Update status survey in DB
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
                survey.save( function(err, survey){
                    if (err) {
                        return next(err);
                    }
                    //A modifier !
                    res.end(JSON.stringify(survey));
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

exports.list_surveys_online = function(req, res, next){
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
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



