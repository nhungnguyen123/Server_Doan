var restful = require('node-restful');
var mongoose = restful.mongoose;

var userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true
	},
	passwork: String,
	quyen: String,
	cmnd: String
});

userSchema.methods = {
	xacthuc: function(pwd) {
		return this.passwork === pwd;
	}
};

module.exports = restful.model('user', userSchema);