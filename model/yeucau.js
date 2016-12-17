var restful = require('node-restful');
var mongoose = restful.mongoose;

var yeuCauSchema = new mongoose.Schema({
    ngaydatyeucau : String,
    hotenKH : String,
    accountKH:String,
    sodt : Number,
    email : String,
    diachi : String,
    cmndTho : String,
	hotenTho: String,
	sdtTho : String,
	dichvuyc: [],
    quan : String,
    ngaylam : String,
    giobatdau : Number,
	gioketthuc : Number,
	phidichvu: Number,
	mota: String,
    nhanxet : String,
	trangthai:String
});

yeuCauSchema.pre('save', function(next) {
    next();
});

module.exports = restful.model('yeucau',yeuCauSchema);