// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Gps', {
	lon 		: {type : String, default: ''},
	lat 		: {type : String, default: ''},
	userID 		: {tyoe : String, default: ''},
	activityId	: {tyoe : String, default: ''}
});