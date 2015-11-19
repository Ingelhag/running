//var Gps = require('./models/Gps');

'use strict';

module.exports = function(app) {

	// Insert routes below
	app.use('/api/', 	                         require('./allRoutes'));


    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};
