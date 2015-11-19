'use strict';

var Activity = require('./activity.model');


// Get all users
exports.get = function(req, res) {
    console.log("Get all users");

    Activity.find(function(err, data) {
        if (err)
          res.send(err);

        res.json(data); 
    });
};

exports.post = function(req, res, next) {
    
  console.log("Add new activity");
  console.log(req.user);



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

exports.paramid = function(req, res, next, id) {
  var query = Activity.findById(id);

  query.exec(function (err, activity){
    if (err) { return next(err); }
    if (!activity) { return next(new Error('can\'t find activity')); }

    req.activity = activity;
    return next();
  });
};