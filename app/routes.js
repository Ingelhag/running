'use strict';

module.exports = function(app) {

	// Insert routes below
	app.use('/api/', require('./allRoutes'));

    app.get('*', function(req, res) {
        res.sendFile('../../public/views/home.html', { root: __dirname });
    });

};
