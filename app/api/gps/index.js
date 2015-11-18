var express 	= require('express');
var controller 	= require('./gps.controller');

var router 		= express.Router();

router.get('/', 	controller.get);
router.get('/add', 	controller.add);

module.exports = router;