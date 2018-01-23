var express = require('express');
var http = require("http");
var mongoose = require('mongoose');
var CONFIG = require("./config.json");
var database = require('./config/database');
process.env.CONFIG = JSON.stringify(CONFIG);
var main = require('./app/routes/main');
var app_mobile= require ('./app/routes/app_mobile');
var cadeaux= require ('./app/routes/cadeaux');
var profil= require ('./app/routes/profil');
var survey_controller = require('./app/controller/surveyController');
var question_controller = require('./app/controller/question_answerController');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');


//Body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var db = mongoose.connection;
mongoose.connect(database.url, { useMongoClient: true});
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function () {
    console.log("we're connected! ");
    console.log("******\n");
});
// When the connection is disconnected
db.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});


app.post('/testdeouf', function(req, res){
    console.log(req.body);
    download(req.body.url, './public/images/caca'   + "_" + Date.now() +'.jpg' , function(err){
        if (err) {
            console.error(err);
            return;
        }

        console.log('Téléchargement terminé !');
    });
});

function download(url, dest, cb) {
    // on créé un stream d'écriture qui nous permettra
    // d'écrire au fur et à mesure que les données sont téléchargées
    const file = fs.createWriteStream(dest);
    var httpMethod;

    // afin d'utiliser le bon module on vérifie si notre url
    // utilise http ou https
    if (url.indexOf(('https://')) !== -1) httpMethod = https;
    else httpMethod = http;

    // on lance le téléchargement
    const request = httpMethod.get(url, function (response) {
        // on vérifie la validité du code de réponse HTTP
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }

        // écrit directement le fichier téléchargé
        response.pipe(file);

        // lorsque le téléchargement est terminé
        // on appelle le callback
        file.on('finish', function () {
            // close étant asynchrone,
            // le cb est appelé lorsque close a terminé
            file.close(cb);
        });
    });

    // check for request error too
    request.on('error', function (err) {
        fs.unlink(dest);
        cb(err.message);
    });

    // si on rencontre une erreur lors de l'écriture du fichier
    // on efface le fichier puis on passe l'erreur au callback
    file.on('error', function (err) {
        // on efface le fichier sans attendre son effacement
        // on ne vérifie pas non plus les erreur pour l'effacement
        fs.unlink(dest);
        cb(err.message);
    });
}





app.use('/', main);
app.use('/app', app_mobile);
app.use('/cadeaux', cadeaux);
app.use('/profil', profil);

// define the home page of app/ route
app.route('/app').get(survey_controller.list_surveys_online);

// define the /:id_survey page of app/ route
app.route('/:id_survey').get(question_controller.list_questions_with_answers);

// init server
var server = http.createServer(app);
server.listen(CONFIG.port,  function(){
    console.log(`Listening at port ${CONFIG.port}`);


    
});






