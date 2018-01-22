/**
 * Created by Robin on 16/01/2018.
 */

var answer_user_model = require('../models/schema_answers_user');


/**Application side
 *
 * Add or update answer sent by user for a question
 *
 * @param req
 * @param res
 */
exports.new_answer_user = function(req, res) {

    var answer = {};
    // Check which parameters are set and add to object.
    // Indexes set to 'undefined' won't be included.
    answer.id_user = req.body.id_contact ?
        req.body.id_contact: "undefined";

    answer.id_survey = req.body.id_survey ?
        req.body.id_survey: "undefined";

    answer.id_question = req.body.id_question ?
        req.body.id_question: "undefined";

    answer.id_answer = req.body.id_reponse ?
        req.body.id_reponse: "undefined";

    console.log('answer ' + answer);
    answer_user_model.findOneAndUpdate({ "id_question": req.body.id_question }, {
        $set: answer}, {upsert:true}, function (err) {
        if (err) res.send(err);
        else {
            console.log("answer user saved");
        }
    });
};