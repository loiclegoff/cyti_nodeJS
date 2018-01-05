var express = require('express');
var http = require("http");
var mongoose = require('mongoose');
var CONFIG = require("./config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
const QuestionModel = require('./app/models/survey');
const AnswersUserModel = require('./app/models/schema_answers_user');
const UserModel = require('./app/models/schema_user');
var app = express();

app.get('/', function(req, res){
    res.send("Hello cyti !!");
})


// init server
var server = http.createServer(app);
server.listen(CONFIG.port,  function(){
    console.log(`Listening at port ${CONFIG.port}`);
});

app.get('/sondages', function(req, res){

    /*//On crée notre model pour insérer des données dans MongoDB en respectant le schema
    var SurveyModel = mongoose.model('surveys', surveySchema);*/

    mongoose.connect('mongodb://localhost/survey', function(err) {
        if (err) { throw err; }
    });

    //On creer une instance de notre model pour creer un nouveau document
    var maquestion = new QuestionModel({
        id_question: new mongoose.Schema.Types.ObjectId(),
        id_survey:"2",
        txt:"Aimes-tu la bière ? ",
        type:true}
    );



    //pour persister donnees dans MongoDB
    maquestion.save(function (err) {
        if (err) { throw err; }
        console.log('Ajout question !');

        mongoose.connection.close();

        console.log('coucou');
    })



     //pour afficher collection dans logs
    /*SurveyModel.find(null, function (err, comms) {
     if (err) { throw err; }
     // comms est un tableau de hash
     console.log(comms);
     });

     //Pour supprimer document avec comme titre "Les habitudes matinales côté make-up"
     SurveyModel.remove({ title : "Les habitudes matinales côté make-up" }, function (err) {
     if (err) { throw err; }
     console.log('title supprimé !');
     });
     */

    res.send("MongoDB");

})




