var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var khachhang = require('../model/khachhang');
var utils = require('../utils/utils');
var async = require('async');
var khachhangmodel = mongoose.model('accountkh', khachhang);

/* GET users listing. */
// khachhang.methods(['post']);
khachhang.register(router,'/khachhang'); 


router.post('/khachhang', function(req, res, next) {
	var kh = new khachhangmodel(req.body);

	kh.save(function(err) {
		if(err) res.send(utils.response(false, {}, utils.getErrorMessage(err)));
		else res.send(utils.response(true, {khachhang: kh}));
	});
});	

router.get('/khachhang', function(req, res, next) {
	console.log(req.body);
	khachhangmodel.find({}, function(err, data) {
		if(err)
			res.send(err);
			res.send(utils.response(true, data));
	})
});


router.post('/loginkhachhang', function(req, res, next) {
	var taikhoan = req.body.taikhoan ? req.body.taikhoan.toString() : '';
	var matkhau = req.body.matkhau ? req.body.matkhau.toString() : '';

	var khachhang;
	console.log(req.body.taikhoan);

	async.series({
		// find user in database. Username can be phone number or email
		findKhachHang: function(cb) {
			khachhangmodel.findOne({
				taikhoan: taikhoan
			}, function(err, result) {
				console.log(result)
				if (err) return cb(true, utils.getErrorMessage(err));
				if (result) {
					khachhang = result;
					return cb();
				}else{
					cb(true, 'Incorrect username or password1');
				}
			});
		},
		validatePassword: function(cb) {
			cb(!khachhang.xacthuc(matkhau), 'Incorrect username or password12');
		}
	}, function(err, results) {
		if (err) {
			res.jsonp(utils.response(false, {}, utils.getLastMessage(results)));
		} else {
			delete khachhang.matkhau;
			res.jsonp(utils.response(true, khachhang));
		}
	});
});




/*

router.get('/timkiemtho', function(req, res, next){
	res.header("Content-Type", "application/json; charset=utf-8");
	
	var cmnd = req.query.cmnd;
	var hoten = req.query.hoten;
	var sotruong = req.query.sotruong;
	
	var result = [];
	thomodel.find({'cmnd': new RegExp(req.query.cmnd, "iu"), 'hoten': new RegExp(req.query.hoten, "iu"), 'sotruong': new RegExp(req.query.sotruong, "iu")}, function(err, data) {
		if(err){
			res.send(err);
		} 
		
		res.send(data);
	})
	
	thomodel.find({'cmnd': new RegExp(req.query.cmnd, "iu"), 'hoten': new RegExp(req.query.hoten, "iu")}, function(err, data) {
		if(err){
			res.send(err);
		} 
		res.send(data);
	})
});
*/

router.put('/khachhang/:cmnd', function(req, res, next) {
	khachhangmodel.findOneAndUpdate({'cmnd': req.params.cmnd},req.body, function(err, data) {
		if(err)
			res.send(err);
		res.send(data)
	})
});

router.delete('/khachhang/:cmnd', function(req, res, next) {
	khachhangmodel.remove({'cmnd': req.params.cmnd}, function(err, result) {
		if(err) 
			res.send(err);
		else
			res.send({messages:"Xóa thành công"});
	})
});

router.get('/khachhang/:cmnd', function(req, res, next) {
	khachhangmodel.findOne({'cmnd': req.params.cmnd}, function(err, data) {
		if(err)
			res.send(err);
		res.send(data);
	})
});

module.exports = router;