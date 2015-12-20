// grab the mongoose module
var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	firstname 	    : {type : String, default: ''},
	lastname 	    : {type : String, default: ''},
    email           : {type : String, default: ''},
    birthYear       : {type : Number, default: ''},
    gender          : {type : String, default: ''},
    activities      : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    longestRun      : {type : Number, default: ''},
    bestAvgTime     : {type : Number, default: ''},
    authentication  : {type : String, default: '2'}
});