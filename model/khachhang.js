var restful = require('node-restful');
var mongoose = restful.mongoose;


/** Check email is existed */
var checkUsername = function(value, callback) {
	mongoose.model('accountkh').find({
		taikhoan: value
	}, function(err, kh) {
		callback(err || kh.length === 0);
	});
};

var khahchangSchema = new mongoose.Schema({
	taikhoan: {
		type: String,
		unique: true,
		lowercase: true,
		validate: [checkUsername, 'Tai khoan da ton tai !']
	},
	matkhau: {
		type: String,
		unique: true
	},
	hoten: String,
	// taikhoan: String,
	diachi: String,
	email:String,
	otp:String

}, {
	versionKey: false
});



khahchangSchema.pre('save', function(next) {
	next();
});

khahchangSchema.methods = {
	xacthuc: function(pwd) {
		return this.matkhau === pwd;
	}
};

module.exports = restful.model('accountkh', khahchangSchema);