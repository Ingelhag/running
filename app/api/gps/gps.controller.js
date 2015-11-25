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
	if(req.query.lon == "" || req.query.lat =="") {
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

exports.makeKML = function(req, res) {
    console.log("MAKE KML");

    Gps.find({'activity': req.activity}, function(err, data) {

        if (err)
            res.send(err);

        var builder = require('xmlbuilder');
        var xml = builder.create('kml')
                    .att('xmlns','http://www.opengis.net/kml/2.2')
                    .ele('Document')
                        .ele('name')
                        .txt('KMLFile')
                        .up()
                        .ele('Style')
                        .att('id', 'transPurpleLineGreenPoly')
                            .ele('LineStyle')
                                .ele('color')
                                .txt('7f00ff00')
                                .up()
                                .ele('width')
                                .txt('7')
                                .up()
                            .up()
                            .ele('PolyStyle')
                                .ele('color')
                                .txt('7f00ff00') 
                                .up()
                            .up()
                        .up()
                        .ele('Placemark')
                            .ele('name')
                            .txt('Absolute')
                            .up()
                            .ele('visibility')
                            .txt('1')
                            .up()
                            .ele('description')
                            .txt('Transparent purple line')
                            .up()
                            .ele('styleUrl')
                            .txt('#transPurpleLineGreenPoly')
                            .up()
                            .ele('LineString')
                                .ele('tessellate')
                                .txt('1')
                                .up()
                                .ele('altitudeMode')
                                .txt('absolute')
                                .up()
                                .ele('coordinates');
                                for(var i=0; i<data.length; i++) {
                                    if(data[i].lon != "") xml = xml.txt(data[i].lon + "," + data[i].lat + ", 0");
                                }
                                xml=xml.up()
                            .up()
                        .up()
                    .up()
                    .end({ pretty: true});

        var fs = require('fs');
        var filePath = "public/content/"+req.activity._id+".kml";

        fs.writeFile(filePath, xml, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
            var path = require('path');
            res.sendFile(path.resolve(filePath));
            console.log("Send file!");
        }); 
    });
}

exports.paramid = function(req, res, next, id) {
  var query = Gps.findById(id);

  query.exec(function (err, gps){
    if (err) { return next(err); }
    if (!gps) { return next(new Error('can\'t find gps')); }

    req.gps = gps;
    return next();
  });
};
