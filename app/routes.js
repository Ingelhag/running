'use strict';

module.exports = function(app) {

	// Insert routes below
	app.use('/api/', require('./allRoutes'));

    app.get('*', function(req, res) {
        res.sendfile('./public/views/home.html'); // load our public/index.html file
    });

};
