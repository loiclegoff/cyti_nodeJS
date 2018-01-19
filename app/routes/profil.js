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
router.get('/', user_controller.list_users);
router.post('/checkUser/facebookConnexion',user_controller.check_user);
//router.get('/create', user_controller.list_users);
router.get('/removePoints/page', user_controller.remove_points);

router.get('/surveys/page', user_controller.list_surveys_completed);

module.exports = router;
