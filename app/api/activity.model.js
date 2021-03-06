// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Activity', {
	category 	: {type : String, default: ''},
    user        : {type : mongoose.Schema.Types.ObjectId, ref: 'User' },
    gpsData     : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gps' }],
    date        : {type : Date, default: Date.now},
    totalTime   : {type : Number, default: 0},
    averageTime : {type : Number, default: 0},
    bestKm      : {type : Number, default: 0},
    distance    : {type : Number, default: 0}
});