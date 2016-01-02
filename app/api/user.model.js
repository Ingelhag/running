// grab the mongoose module
var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	firstname 	    : {type : String, default: ''},
	lastname 	    : {type : String, default: ''},
    email           : {type : String, default: ''},
    birthYear       : {type : Number, default: 1900},
    gender          : {type : String, default: ''},
    activities      : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    longestRun      : {type : Number, default: 0},
    bestAvgTime     : {type : Number, default: 0},
    authentication  : {type : Number, default: 2}
});