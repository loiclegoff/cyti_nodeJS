/**
 * Created by Robin on 10/01/2018.
 */

var mongoose = require('mongoose');
var database = require('../../config/database');
var cadeaux_model = require('../models/cadeaux');

//sanitizes inputs against query selector injection attacks
var sanitize = require('mongo-sanitize');


/** Create a new survey in survey collection
 *
 * @param req
 * @param res
 */
exports.new_cadeau = function(req, res) {

    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var cadeaux = {
            title: sanitize("Cadeaux numero 1"),
            description: sanitize("Petit cadeau tres sympa pas cher"),
            cadeaux_type: sanitize("1"),
            points: sanitize("45"),
            url: sanitize("https://shoutem.github.io/img/ui-toolkit/examples/image-7.png")        };
        new cadeaux_model(cadeaux).save(function (err, cadeaux) {
            if (err) {
                throw err;
            }
            var id_survey = cadeaux._id;
            //we get the Object_ID of the current survey
            cadeaux_model.findById(id_survey,function(err, cadeaux){
                if (err) {
                    // Note that this error doesn't mean nothing was found,
                    // it means the database had an error while searching, hence the 500 status
                    res.status(500).send(err);
                } else {
                    res.status(200).send(cadeaux[0]);
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


exports.list_cadeaux_online = function(req, res, next){
    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        cadeaux_model.find(function (err, cadeaux) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
                return next(err);
            }
                mongoose.connection.close();
                res.end(JSON.stringify(cadeaux));

        });
    });
    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });
};



