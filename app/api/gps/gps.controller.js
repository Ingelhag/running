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

exports.post = function(req,res, next) {
	console.log("Add GPS data");

	// Check if incomming data is correct
	if(req.query.lon == "" || req.query.lat =="") {
		res.send("Error");
	} else { // Save lon och lat
		var gps = new Gps();
    	gps.lon = req.query.lon;
    	gps.lat = req.query.lat;
        gps.activity = req.activity;

        console.log(req);

		gps.save(function(err, gps){
			if(err){ return next(err); } 

            req.activity.gpsData.push(gps);
            req.activity.save(function(err,activity) {
                if(err) {return next(err);}
                res.json(gps);
            })
		});
	}
};

exports.paramid = function(req, res, next, id) {
  var query = Gps.findById(id);

  query.exec(function (err, gps){
    if (err) { return next(err); }
    if (!gps) { return next(new Error('can\'t find gps')); }

    req.gps = gps;
    return next();
  });
};
