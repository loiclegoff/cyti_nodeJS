/**
 * Created by Robin on 20/12/2017.
 */

var mongoose = require('mongoose'), Schema = mongoose.Schema;

/**
 * Schema definition
 */

//schema for users answers
var answers_userSchema = new Schema({
    id_user: String,
    id_survey: String,
    id_question: String,
    date: { type: Date, default: Date.now },
    id_answer: [String]
    },{
    versionKey: false
    });


var answers_user = mongoose.model('answers_user', answers_userSchema);

module.exports = answers_user;
