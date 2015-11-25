'use strict';

var Activity = require('./activity.model');


// Get all users
exports.getAll = function(req, res) {

    Activity.find(function(err, data) {
        if (err)
          res.send(err);

        res.json(data); 
    });
};

// Get all users
exports.get = function(req, res) {
    console.log("Get all activities from user: " + req.user._id);

    Activity.find({'user': req.user._id},function(err, data) {
        if (err)
          res.send(err);

        res.json(data); 
    });
};

exports.post = function(req, res, next) {
    
  console.log("Add new activity");
  var activity = new Activity();
  activity.activity = req.activity;
  activity.user     = req.user;

  activity.save(function(err, activity){
    if(err){ return next(err); }

    req.user.activities.push(activity);
    req.user.save(function(err, user) {
      if(err){ return next(err); }

      res.json(activity);
    });
  });
};

exports.update = function(req, res) {

  console.log("Update activity");

  req.activity.totalTime = req.query.totalTime;
  req.activity.averageTime = req.query.avgTime;
  req.activity.distance = req.query.distance;

  req.activity.save(function(err, activity) {
    if(err){return next(err);}
    res.json(activity);
  });

};

exports.paramid = function(req, res, next, id) {
  var query = Activity.findById(id);

  query.exec(function (err, activity){
    if (err) { return next(err); }
    if (!activity) { return next(new Error('can\'t find activity')); }

    req.activity = activity;
    return next();
  });
};