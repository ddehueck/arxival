var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },

	email:  {
    type: String,
    unique: true,
    required: true,
    trim: true
  }, 

	passwordHash: {
		type: String,
		required: true,
	},

	salt: {
		type: String,
		required: true,
	},

	subjects: [String],
	library: [String],
});

var User = mongoose.model('User', userSchema);

module.exports = User;
