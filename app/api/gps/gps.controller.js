'use strict';

var Gps = require('./gps.model');

// Get list of things
exports.index = function(req, res) {
  User.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

// Get all data from gps
exports.get = function(req, res) {
	console.log("Get GPS data");

    Gps.find(function(err, data) {

        if (err)
            res.send(err);

        res.json(data); 
    });
};

exports.add = function(req,res) {
	console.log("Add GPS data");

	// Check if incomming data is correct
	if(req.query.lon == "" || req.query.lat =="") {
		res.send("Error");
	} else { // Save lon och lat
		var newGPS = new Gps();
    	newGPS.lon = req.query.lon;
    	newGPS.lat = req.query.lat;

		newGPS.save(function(err, data){
			if(err){ return next(err); } 

			res.json(data);
		});
	}
};