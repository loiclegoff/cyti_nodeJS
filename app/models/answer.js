/**
 * Created by Robin on 29/12/2017.
 */

var mongoose = require('mongoose'), Schema = mongoose.Schema;


/**
 * Schema definition
 */

//schema for an answer
var answerSchema = new Schema({
    id_question: Schema.Types.ObjectId,
    id_survey: Schema.Types.ObjectId,
    position: Number,
    txt: String
    },
    { versionKey: false
    });

// answerSchema compiled into answer Model
var answer = mongoose.model('answer', answerSchema);

module.exports = answer;


