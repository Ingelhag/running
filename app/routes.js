//var Gps = require('./models/Gps');

'use strict';

module.exports = function(app) {

	// Insert routes below
	app.use('/api/gps', require('./api/gps'));


   //  // Get all data from gps
   //  app.get('/api/gps', function(req, res) {
   //  	console.log("Get GPS data");

   //      Gps.find(function(err, data) {

   //          if (err)
   //              res.send(err);

   //          res.json(data); 
   //      });
   //  });

   //  app.get('/api/add/gps', function(req,res) {
   //  	console.log("Add GPS data");

   //  	// Check if incomming data is correct
   //  	if(req.query.lon == "" || req.query.lat =="") {
   //  		res.send("Error");
   //  	} else { // Save lon och lat
   //  		var newGPS = new Gps();
	  //   	newGPS.lon = req.query.lon;
	  //   	newGPS.lat = req.query.lat;

			// newGPS.save(function(err, data){
			// 	if(err){ return next(err); } 

			// 	res.json(data);
			// });
   //  	}
   //  });

    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};
