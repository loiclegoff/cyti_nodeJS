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
                }
            });
        });
};


exports.list_users = function(req, res, next){

        user_model.find(function (err, cadeaux) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
                return next(err);
            }
                res.end(JSON.stringify(cadeaux));

        });

};

exports.check_user = function(req, res, next){

        user_model.find({"id_facebook":req.params.id_facebook} ,function (err, user) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
                return next(err);
            }
            if(user[0] != null){
                res.json(user);
            }else{
                var user = {
                    id_facebook: req.params.id_facebook,
                    username: req.query.username,
                    login: "",
                    mdp: "",
                    owner: 0,
                    points : 0,
                    surveys: [] ,
                    url_fb_picture: req.query.url

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
                            var test=[];
                            test.push(JSON.stringify(user));
                            console.log(test);
                            res.json([user]);
                        }
                    });
                });
            }

        });        
};

exports.updates_after_survey = function(req, res){
    console.log(req.body);
    user_model.findById(req.body.id_user, function(err, user) {
        if (err) res.status(500).send(err);
        else {
            var points_user = user.points + 50;
            user_model.findByIdAndUpdate(req.body.id_user, {$push: {surveys: req.params.id_survey},
                $set: {points: points_user}}, {new: true}, function (err, user) {
                    if (err) res.send(err);
                    else {
                        console.log("new update point: " + user.points + " surveys_array : " + user.surveys);
                    }
                });
        }
    });
};

