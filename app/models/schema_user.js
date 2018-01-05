/**
 * Created by Robin on 20/12/2017.
 */

var mongoose = require('mongoose'), Schema = mongoose.Schema;


/**
 * Schema definition
 */


//schema pour un utilisateur
var userSchema = new Schema({
    id_user: Schema.Types.ObjectId,
    username: String,
    owner: Boolean,
    surveys: [{
        type: Schema.Types.ObjectId,
        ref: 'survey'
    }]
});

module.exports = mongoose.model('user', userSchema);

