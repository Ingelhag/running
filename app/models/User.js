// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', {
	firstname 	: {type : String, default: ''},
	lastname 	: {type : String, default: ''},
	email 		: {tyoe : String, default: ''}
});