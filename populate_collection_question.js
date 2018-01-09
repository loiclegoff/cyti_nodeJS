/**
 * Created by Robin on 15/12/2017.
 */

var app= require('express');
var mongoose = require('mongoose');
var database = require('./config/database');
var survey_model = require('./app/models/survey');
var question_model = require('./app/models/question');
var answer_model = require('./app/models/answer');
var user_model = require('./app/models/schema_user');
var fs = require('fs');

var methods = require('./parsing_json');

var getObjects = methods.getObjects;
var getValues = methods.getValues;
var getKeys = methods.getKeys;


/**
 * Connect to the db
 */


console.log("\n *STARTING* \n");
// Get content from file




fs.readFile('./question_post.json', 'utf8', function (err, data)
{
    if (err) throw err;
    var monJson = JSON.parse(data);

    var db = mongoose.connection;
    mongoose.connect(database.url);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.on('open', function() {
        console.log("we're connected!");

        console.log("******\n");
        //create_survey_obj();


        var question_obj = question_model({
            id_survey: getValues(monJson, 'id_survey'),
            position: getValues(monJson, 'question_position'),
            txt:getValues(monJson, 'question_txt'),
            type: getValues(monJson, 'question_type'),
            mandatory: getValues(monJson, 'mandatory'),
            answers:[getObjects(monJson, 'answer_txt')
            ]
        });
        console.log('question_position ' + getValues(monJson, 'question_position'));

        console.log(question_obj.answers);

        //parent.save(callback);

       /* var answers_ID = [];
        var answers_obj = getObjects(monJson, 'txt', '');

        for (var i=0 in answers_obj)
        {
            console.log(answers_obj[i]);
            new answer_model(answers_obj[i]).save(function (err, answer){
                if (err) { throw err; }
                answers_ID[i] = answer._id;
                mongoose.connection.close();

            });
        }
*/







    });
        /**
         * User datas saved
         */
        function create_user_obj(id_survey) {
            var user_obj = {
                username : getValues(monJson, 'name'),
                owner: true,
                surveys: id_survey};
            console.log(user_obj);
            new user_model(user_obj).save(function (err){
                 if (err) { throw err; }
                 console.log('caca');
                 mongoose.connection.close();
                 });
        }






        /**
         * Surveys data saved
         */
        function create_survey_obj() {
            var survey_obj = {
                title: getValues(monJson, 'title'),
                description: getValues(monJson, 'description'),
                start_date: getValues(monJson, 'start_date'),
                end_date: getValues(monJson, 'end_date'),
                survey_type: getValues(monJson, 'survey_type'),
                theme: getValues(monJson, 'theme'),
                status: getValues(monJson, 'status'),
                //picture: getValues(monJson, 'title'),
                duration: getValues(monJson, 'duration')
            };
            new survey_model(survey_obj).save(function (err, survey) {
                if (err) {
                    throw err;
                }
                //we get the Object_ID of the current survey
                var id_survey = survey._id;
                create_user_obj(id_survey);
                //create_question_obj(id_survey);

                mongoose.connection.close();
            });
        }
});


        /**
         * question data saved
         */
        function create_question_obj(id_survey){

            var obj_temp = getObjects(monJson, 'question_type','');
            for (var i in obj_temp) {
                console.log(obj_temp[i].txt);
                var question_obj = {
                    id_survey: id_survey,
                    position: obj_temp[i].position,
                    txt: obj_temp[i].txt,
                    type: obj_temp[i].question_type,
                    mandatory: obj_temp[i].mandatory
                };
                new question_model(question_obj).save(function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log('coco');
                    mongoose.connection.close();
                });
            }

        }









function done(err) {
    if (err) console.error(err.stack);
    mongoose.connection.db.dropDatabase(function() {
        mongoose.connection.close();
    });
}

