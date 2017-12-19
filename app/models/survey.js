/**
 * Created by Robin on 19/12/2017.
 */

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/survey', function(err) {
    if (err) { throw err; }
});

// Define survey schema
var surveySchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    survey_type: String,
    theme: String,
    status: String,
    questionsArray: [{
        id_question: Number,
        txt:  String,
        question_type: String,
        mandatory: Boolean,
        answerArray:[{
            id_answer: Number,
            txt: String
        }]
    }]
});

module.exports = mongoose.model('surveys', surveySchema);