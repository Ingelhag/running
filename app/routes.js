var Data = require('./models/Data');

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/data', function(req, res) {
    	console.log("HELLO");
        // use mongoose to get all nerds in the database
        Data.find(function(err, data) {

            if (err)
                res.send(err);

            res.json(data); 
        });
    });

    app.post('/api/data', function(req,res) {
    	var newData = new Data();
    	newData.lon = req.query.lon;
    	newData.lat = req.query.lat;

		newData.save(function(err, post){
			if(err){ return next(err); }

			res.json(post);
		});
    });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};
