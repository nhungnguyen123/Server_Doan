var restful = require('node-restful');
var mongoose = restful.mongoose;


var checkCMND = function(value, callback) {
    mongoose.model('tho').find({
        cmnd: value
    }, function(err, tho) {
        callback(err || tho.length === 0);
    });
};

var thoSchema = new mongoose.Schema({
    cmnd: {
        type: String,
        unique: true,
        validate: [checkCMND, 'So CMNND da ton tai !']
    },
    hoten: String,
    ngaysinh: Date,
    gioitinh: String,
    sodt: Number,
    email: String,
    quequan: String,
    diachihientai: String,
    diachi: {
        tenkhuvuc: String,
        quan: String
    },
    trinhdohocvan: String,
    sotruong: [],
    sonamkinhnghiem: Number,
    motakinhnghiem: String,
    hinhanh: String,
    danhgia: String,
    xacnhan: Boolean
});

thoSchema.pre('save', function(next) {
    next();
});

module.exports = restful.model('tho', thoSchema);