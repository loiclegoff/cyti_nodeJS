 /**
 * Created by Antoine on 16/01/2018.
 */

var mongoose = require('mongoose');
var database = require('../../config/database');
var user_model = require('../models/schema_user');
var cadeaux_model = require('../models/cadeaux');

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

        user_model.find(function (err, user) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
                return next(err);
            }
                res.end(JSON.stringify(user));

        });

};


exports.remove_points = function(req, res, next){

        user_model.findByIdAndUpdate(req.query.id, { $set: {points : req.query.points}}, function (err, user) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
                return next(err);
                res.status(500).send(err);
            }
            


        });

        cadeaux_model.find({ points : { $lte: req.query.points}}, function (err, cadeaux) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
                res.status(500).send(err);
            }
                res.json(cadeaux);

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
                    surveys: [],
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
