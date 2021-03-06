'use strict';

var Gps = require('./gps.model');

// Get gps data
exports.getAll = function(req, res) {
    console.log("Get all users");

    Gps.find(function(err, data) {
        if (err)
          res.send(err);

        res.json(data); 
    });
};

// Get all data from gps
exports.get = function(req, res) {
	console.log("Get GPS data from activity: " + req.activity._id);

    Gps.find({'activity': req.activity}, function(err, data) {

        if (err)
            res.send(err);

        res.json(data); 
    });
};

exports.post = function(req,res,next) {

    console.log("Add new gpsdata");

	// Check if incomming data is correct
	if(req.query.lon == null) {
		res.send("Error");
	} else { // Save lon och lat
		var gps = new Gps();
    	gps.lon = req.query.lon;
    	gps.lat = req.query.lat;
        gps.activity = req.activity;

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
