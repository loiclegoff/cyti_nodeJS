/**
 * Created by Antoine on 15/01/2018.
 */

var mongoose = require('mongoose');
var cadeaux_model = require('../models/cadeaux');

//sanitizes inputs against query selector injection attacks
var sanitize = require('mongo-sanitize');


/** Create a new survey in survey collection
 *
 * @param req
 * @param res
 */
exports.new_cadeau = function(req, res) {

        var cadeaux = {
            title: sanitize("Cadeaux numero 1"),
            description: sanitize("Petit cadeau tres sympa pas cher"),
            cadeaux_type: sanitize("1"),
            points: 45,
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
                }
            });
        });
};


exports.list_cadeaux_online = function(req, res){

        cadeaux_model.find({ points : { $lte: req.query.points}}, function (err, cadeaux) {
            if (err) {
                // Note that this error doesn't mean nothing was found,
                // it means the database had an error while searching, hence the 500 status
                res.status(500).send(err);
            }
                res.json(cadeaux);

        });

};



