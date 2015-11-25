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
router.post('/user/:user/update', userController.update);

// Activity
router.param('activity', activityController.paramid);
router.get('/user/:user/activity', activityController.get);
router.post('/user/:user/activity', activityController.post);
router.post('/user/:user/activity/:activity/update', activityController.update);
router.get('/user/:user/activity/:activity', function(req, res) {
  res.json(req.activity);
});

// Gps
router.param('gps', gpsController.paramid);
router.get('/user/:user/activity/:activity/gps', gpsController.get);
router.get('/user/:user/activity/:activity/gps/add', gpsController.post);
router.get('/user/:user/activity/:activity/gps/makeKML', gpsController.makeKML);
router.get('/user/:user/activity/:activity/gps/:gps/', function(req, res) {
  res.json(req.activity);
});


module.exports = router;