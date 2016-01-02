// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Gps', {
    lon         : { type : Number, default: 0},
    lat         : { type : Number, default: 0},
    activity    : { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
    time        : { type: Date, default: Date.now}
});