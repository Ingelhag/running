// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Activity', {
	activity 	: {type : String, default: ''},
    user        : {type : mongoose.Schema.Types.ObjectId, ref: 'User' },
    gpsData     : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gps' }],
    date        : {type : Date, default: Date.now},
    totalTime   : {type : Number, default: ""},
    averageTime : {type : Number, default: ""},
    bestKm      : {type : Number, default: ""},
    distance    : {type : Number, default: ""}
});