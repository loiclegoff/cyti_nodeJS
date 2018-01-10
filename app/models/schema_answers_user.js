/**
 * Created by Robin on 20/12/2017.
 */

var mongoose = require('mongoose'), Schema = mongoose.Schema;

/**
 * Schema definition
 */

//schema pour les reponses donnees par l'utilisateur
var answers_userSchema = new Schema({
    id_user: Schema.Types.ObjectId,
    id_questions: Schema.Types.ObjectId,
    id_answer: Schema.Types.ObjectId

})




module.exports = mongoose.model('answers_user', answers_userSchema);