/**
 * Created by Robin on 10/01/2018.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cadeaux_controller = require('../controller/cadeauxController');

//Body parser
router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

// define the home page of app/ route
router.get('/', cadeaux_controller.list_cadeaux_online);
//router.get('/', cadeaux_controller.new_cadeau);

module.exports = router;
