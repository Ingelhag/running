// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Gps', {
    lon         : {type : String, default: ''},
    lat         : {type : String, default: ''},
    activity    : { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }
});