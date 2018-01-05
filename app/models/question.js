/**
 * Created by Robin on 29/12/2017.
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema;

/**
 * Schema definition
 */

// schema of a question; includes answer model
    var questionSchema = new Schema({
    id_survey: Schema.Types.ObjectId,
    position: Number,
    txt:String,
    type: String,
    mandatory: Boolean,
    answers:[{
        type: Schema.Types.ObjectId,
        ref: 'answer'
    }]
});

// questionSchema compiled into question Model
var question = mongoose.model('question', questionSchema);

module.exports = question;