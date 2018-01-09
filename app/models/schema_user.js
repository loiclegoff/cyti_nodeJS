/**
 * Created by Robin on 20/12/2017.
 */

var mongoose = require('mongoose'), Schema = mongoose.Schema;


/**
 * Schema definition
 */


//schema pour un utilisateur
var userSchema = new Schema({
    username: String,
    owner: Boolean,
    surveys: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('user', userSchema);

