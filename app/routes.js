var Gps = require('./models/Gps');

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/gps', function(req, res) {
    	console.log("Get GPS data");
        // use mongoose to get all nerds in the database
        Gps.find(function(err, data) {

            if (err)
                res.send(err);

            res.json(data); 
        });
    });

    app.post('/api/gps', function(req,res) {
    	console.log("Add GPS data");
    	var newGPS = new Gps();
    	newGPS.lon = req.query.lon;
    	newGPS.lat = req.query.lat;

		newGPS.save(function(err, data){
			if(err){ return next(err); }

			res.json(data);
		});
    });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};
