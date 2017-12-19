var express = require('express');
var http = require("http");
var mongoose = require('mongoose');
var CONFIG = require("./config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
const SurveyModel = require('./app/models/survey');


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
    var monSondage = new SurveyModel({title: "Les habitudes matinales côté make-up"});
    monSondage.theme="beauty";

    //pour persister donnees dans MongoDB
    monSondage.save(function (err) {
        if (err) { throw err; }
        console.log('Ajout title avec succès !');

        mongoose.connection.close();
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




