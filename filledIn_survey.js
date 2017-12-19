/**
 * Created by Robin on 19/12/2017.
 */

var mongoose = require('mongoose');
var Survey = require('./app/models/survey');

//import Survey from './app/models/survey';

const surveys= [
    {
        title: "Les habitudes matinales côté make-up",
        description: "Sondage de beauté",
        date: 15 / 12 / 17,
        survey_type: "fun",
        theme: "beauty",
        status: "online",
        questionsArray: [{
            id_question: 0,
            txt: "Te maquilles-tu régulièrement ?",
            question_type: "YesNo",
            mandatory: true,
            answerArray: [{
                id_answer: 0,
                txt: "Yes"
            },
            {
                    id_answer: 1,
                    txt: "No"
            }]
        },
        {
            id_question: 1,
            txt: "Comment réveiller des yeux fatigués ?",
            question_type: "unique",
            mandatory: true,
            answerArray: [{
                id_answer: 0,
                txt: "La solution make-up"
            },
                {
                    id_answer: 1,
                    txt: "La solution clinique"
                }]

        }]
    },
    {
        title: "Es-tu un crossfiter ?",
        description: "Sondage de sport basé sur le crossfit",
        date: 19 / 12 / 17,
        survey_type: "fun",
        theme: "sport",
        status: "online",
        questionsArray: [{
            id_question: 0,
            txt: "Vas-tu à la salle ?",
            question_type: "YesNo",
            mandatory: true,
            answerArray: [{
                id_answer: 0,
                txt: "Yes"
            },
                {
                    id_answer: 1,
                    txt: "No"
                }]
            },
            {
                id_question: 1,
                txt: "A quelle fréquence hebdomadaire vas-tu au temple ?",
                question_type: "unique",
                mandatory: true,
                answerArray: [{
                    id_answer: 0,
                    txt: "never des never"
                },
                {
                        id_answer: 1,
                        txt: "Une à deux fois "
                },
                {
                        id_answer: 2,
                        txt: "plus de trois fois pour faire du sale!"
                }
                ]
            }]
    }
]

mongoose.connect('mongodb://localhost/movies');

// Go through each survey
surveys.map(data, function() {
    // Initialize a model with movie data
    const survey = new Survey(data);
    // and save it into the database
    survey.save();
});
