'use strict';

var User = require('./user.model');
var Activity = require('./activity.model');
var Gps = require('./gps.model');


exports.makeXML = function(req, res) {

    User.find(function(err, users) {
        if (err)
          res.send(err);

        Activity.find(function(err, activities) {
            if (err)
              res.send(err);

            Gps.find(function(err, gps) {
                if (err)
                  res.send(err);

                var fs = require('fs');
                var filePath = "public/content/db.xml";

                fs.writeFile(filePath, createXML(users, activities, gps), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                    var path = require('path');
                    res.download(path.resolve(filePath));
                    console.log("Send file!");
                });
            });
        });
    });
}

function createXML(users, activities, gps) {

    var currentActivity = [];
    var currentGps = []; 
    var $ = require('jquery');

    var builder = require('xmlbuilder');
    var xml = builder.create('runningGPS');
    for(var i = 0; i<users.length; i++) {
        xml = xml
                .ele('User')
                    .ele('firstname')
                    .txt(users[i].firstname)
                    .up()
                    .ele('lastname')
                    .txt(users[i].lastname)
                    .up()
                    .ele('email')
                    .txt(users[i].email)
                    .up()
                    .ele('longestRun')
                    .txt(users[i].longestRun)
                    .up()
                    .ele('bestAvgTime')
                    .txt(users[i].bestAvgTime)
                    .up()
                    .ele('authentication')
                    .txt(users[i].authentication)
                    .up();
                    for(var j=0; j<users[i].activities.length; j++) {
                        currentActivity = findElement(activities, users[i].activities[j]);
                        xml = xml
                                .ele('Activity')
                                    .ele('activity')
                                    .txt(currentActivity.activity)
                                    .up()
                                    .ele('date')
                                    .txt(currentActivity.date)
                                    .up()
                                    .ele('totalTime')
                                    .txt(currentActivity.totalTime)
                                    .up()
                                    .ele('averageTime')
                                    .txt(currentActivity.averageTime)
                                    .up()
                                    .ele('bestKm')
                                    .txt(currentActivity.bestKm)
                                    .up()
                                    .ele('distance')
                                    .txt(currentActivity.distance)
                                    .up();
                                    for(var k=0; k<currentActivity.gpsData.length; k++) {
                                        currentGps = findElement(gps, currentActivity.gpsData[k]);
                                        if(currentGps.lat != "") {
                                            xml = xml.ele('gps')
                                                .ele('lon')
                                                .txt(currentGps.lon)
                                                .up()
                                                .ele('lat')
                                                .txt(currentGps.lat)
                                                .up()
                                                .ele('time')
                                                .txt(currentGps.time)
                                                .up()
                                            .up();
                                        }
                                    }
                            xml = xml.up()
                    }
                xml = xml.up();
    }
    xml = xml.end({ pretty: true});

    return(xml);
}

function findElement(array, key) {
    for(var i=0; i<array.length; i++){
        if(array[i]._id.toString() == key.toString()) {
            return array[i];
        }
    }
    return null;
}

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