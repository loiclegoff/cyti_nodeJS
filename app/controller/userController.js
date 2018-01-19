 /**
 * Created by Antoine on 16/01/2018.
 */

var mongoose = require('mongoose');
var database = require('../../config/database');
var user_model = require('../models/schema_user');
var cadeaux_model = require('../models/cadeaux');
var survey_model = require('../models/survey');

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


exports.remove_points = function(req, res){

        user_model.findByIdAndUpdate(req.query.id, { $set: {points : req.query.points}}, function (err) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
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
    user_model.find({"id_facebook":req.body.id_facebook} ,function (err, user) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
                return next(err);
            }
            if(user[0] !== null){
                console.log(user);
                res.json(user);
            }else{
                var user = {
                    id_facebook: req.body.id_facebook,
                    username: req.body.username,
                    login: "",
                    mdp: "",
                    owner: 0,
                    points : 0,
                    surveys: [],
                    url_fb_picture: req.body.lien

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
                            res.json([user]);
                        }
                    });
                });
            }

        });        

};

exports.updates_after_survey = function(req, res){

    /*user_model.findById(req.body.id_user, function(err, user) {
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
    });*/
    survey_model.findById(req.params.id_survey, function(err, survey){
        if(err) res.status(500).send(err);
        else{
            var survey_points = survey.points;
            user_model.findById(req.body.id_user, function(err, user) {
                if (err) res.status(500).send(err);
                else {
                    var points_user = user.points + survey_points;
                    user_model.findByIdAndUpdate(req.body.id_user, {
                        $push: {surveys: req.params.id_survey},
                        $set: {points: points_user}
                    }, {new: true}, function (err, user) {
                        if (err) res.send(err);
                        else {
                            console.log("new update point: " + user.points + " surveys_array : "
                                + user.surveys+ " surveys points : " + survey_points);
                        }
                    });
                }
            });
        }
    });


};


exports.list_surveys_completed = function(req, res){
    user_model.findById(req.query.id_user).populate({
        path: "surveys", model: "survey"}).exec(function(err, user ) {
        if (err) res.send(err);
        else {
        var myObj, x;
        console.log(user);
        
        myObj = {
            "surveys":user.surveys,
            "beauty":0,
            "sport":0,
            "shopping":0,
            "mode":0,
            "total":0
        };
        user.surveys.map(function(item) { 
          switch(item.theme) {
                case "beauty":
                    myObj.beauty = Number(myObj.beauty)+1;
                    break;
                case "sport":
                    myObj.sport = Number(myObj.sport)+1;
                    break;
                case "shopping":
                    myObj.shopping = Number(myObj.shopping)+1;
                    break;
                case "mode":
                    myObj.mode = Number(myObj.mode)+1;
                    break;
                default:
            }       
        });
            myObj.total=Number(myObj.beauty)+Number(myObj.mode)+Number(myObj.sport)+Number(myObj.shopping);
            res.json(myObj);
        }


    });
};

