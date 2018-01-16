 /**
 * Created by Antoine on 16/01/2018.
 */

var mongoose = require('mongoose');
var database = require('../../config/database');
var user_model = require('../models/schema_user');

//sanitizes inputs against query selector injection attacks
var sanitize = require('mongo-sanitize');


/** Create a new survey in survey collection
 *
 * @param req
 * @param res
 */
exports.new_user = function(req, res) {

    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function () {
        console.log("we're connected!");
        console.log("******\n");
        var user = {
        	id_facebook: "idfacebook",
    		username: "username",
    		login: "login",
    		mdp: "mdp",
    		owner: 0,
    		points : "1050"
    	};
        new user_model(user).save(function (err, user) {
            if (err) {
                throw err;
            }
            var id_user = user._id;
            //we get the Object_ID of the current survey
            user_model.findById(id_user,function(err, user){
                if (err) {
                    // Note that this error doesn't mean nothing was found,
                    // it means the database had an error while searching, hence the 500 status
                    res.status(500).send(err);
                } else {
                    res.status(200).send(user[0]);
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
        user_model.find(function (err, cadeaux) {
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


