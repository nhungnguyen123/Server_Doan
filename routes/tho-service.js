var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var tho = require('../model/tho');
var utils = require('../utils/utils');

var thomodel = mongoose.model('tho', tho);

/* GET users listing. */
// tho.methods(['post']);
tho.register(router, '/tho');

router.post('/tho', function(req, res, next) {
	var body = req.body;
	console.log(body);
	var tho = new thomodel(body);
	tho.save(function(err) {
		if(err) res.send(utils.response(false, {}, utils.getErrorMessage(err), 403));
		else res.send(utils.response(true, {_id: tho._id}));
	});
});

router.get('/tho', function(req, res, next) {
	thomodel.find({}, function(err, data) {
		if (err)
			res.send(err);

		console.log(data);
		res.send(utils.response(true, data));
	})
});

router.get('/timkiemtho', function(req, res, next) {
	res.header("Content-Type", "application/json; charset=utf-8");

	var cmnd = req.query.cmnd;
	var hoten = req.query.hoten;
	var sotruong = req.query.sotruong;

	var result = [];
	/*thomodel.find({'cmnd': new RegExp(req.query.cmnd, "iu"), 'hoten': new RegExp(req.query.hoten, "iu"), 'sotruong': new RegExp(req.query.sotruong, "iu")}, function(err, data) {
		if(err){
			res.send(err);
		} 
		
		res.send(data);
	})*/

	thomodel.find({
		'cmnd': new RegExp(req.query.cmnd, "iu"),
		'hoten': new RegExp(req.query.hoten, "iu")
	}, function(err, data) {
		if (err) {
			res.send(err);
		}
		res.send(utils.response(true, data));
	})
});

router.put('/tho/:cmnd', function(req, res, next) {
	thomodel.findOneAndUpdate({
		'cmnd': req.params.cmnd
	}, req.body, function(err, data) {
		if (err)
			res.send(err);
		res.send(utils.response(true, data));
	})
});

router.delete('/tho/:cmnd', function(req, res, next) {
	thomodel.remove({
		'cmnd': req.params.cmnd
	}, function(err, result) {
		if (err)
			res.send(err);
		else
			res.send({
				messages: "Xóa thành công"
			});
	})
});

router.get('/tho/:cmnd', function(req, res, next) {
	thomodel.findOne({
		'cmnd': req.params.cmnd
	}, function(err, data) {
		if (err)
			res.send(err);
		res.send(utils.response(true, data));
	})
});

module.exports = router;