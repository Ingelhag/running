var express             = require('express');
var userController      = require('./api/user/user.controller');
var activityController  = require('./api/activity/activity.controller');
var gpsController       = require('./api/gps/gps.controller');

var router      = express.Router();


// User
router.get('/user',         userController.get);
router.get('/user/login',   userController.login);
router.param('user',        userController.paramid);
router.get('/user/:user', function(req, res) {
  res.json(req.user);
});

// Activity
router.param('activity', activityController.paramid);
router.post('/user/:user/activity', activityController.post);
router.get('/user/:user/activity/:activity', function(req, res) {
  res.json(req.activity);
});

// Gps
router.param('gps', gpsController.paramid);
router.get('/user/:user/activity/:activity/gps', gpsController.post);
router.get('/user/:user/activity/:activity/gps/:gps/', function(req, res) {
  res.json(req.activity);
});


module.exports = router;