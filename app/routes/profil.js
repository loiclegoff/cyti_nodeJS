/**
 * Created by Antoine on 16/01/2018.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var user_controller = require('../controller/userController');

//Body parser
router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

// define the home page of app/ route
//router.get('/', user_controller.new_user);
router.get('/', user_controller.list_cadeaux_online);

module.exports = router;
