'use strict';

var User = require('./user.model');

exports.login = function(req, res) {

  // Set attributes     
  var user = new User();
  user.firstname      = req.query.firstName;
  user.lastname       = req.query.lastName;
  user.email          = req.query.email;
  user.gender         = req.query.gender;
  user.birthYear      = req.query.birthYear;

  // Check if a user exists, else create one. Returns the user
  User.findOne({'email' : user.email}, function(err, theUser) {
    if(err) {
      console.log("Error");
    } else if(theUser != null) {
      console.log("Found User");
      console.log(theUser);
      return res.json(theUser);
    } else {
      console.log("Create new user");
      user.save(function(err) {
        if (err) // If fail
            res.send(err);

        // If succeed
        return res.json(user);
      });
    }
  });
};

// Get all users
exports.get = function(req, res) {
    console.log("Get all users");

    User.find(function(err, data) {
        if (err)
          res.send(err);

        res.json(data); 
    });
};

exports.update = function(req, res) {

  console.log("Update user");

  if(parseFloat(req.user.bestAvgTime) > parseFloat(req.query.averageTime) || req.user.bestAvgTime == "") req.user.bestAvgTime = req.query.averageTime;
  if(parseFloat(req.user.longestRun) < parseFloat(req.query.distance) || req.user.longestRun == "") req.user.longestRun  = req.query.distance;

  req.user.save(function(err, user) {
    if(err){return next(err);}
    res.json(user);
  });

};

exports.paramid = function(req, res, next, id) {
  var query = User.findById(id);

  query.exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error('can\'t find user')); }

    req.user = user;
    return next();
  });
};

