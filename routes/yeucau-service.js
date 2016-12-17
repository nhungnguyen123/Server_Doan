var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var yeucau = require('../model/yeucau');
var utils = require('../utils/utils');
var yeucaumodel = mongoose.model('yeucau', yeucau);
var YeuCau = require('../model/yeucau');
var async = require('async');

/* GET users listing. */
// yeucau.methods(['post']);
yeucau.register(router, '/yeucau');

router.post('/yeucau', function(req, res, next) {
	console.log(req.body);
	var yc = new YeuCau(req.body);
			yc.save(function(err) {
			if(err)res.send(utils.response(false, {}, utils.getErrorMessage(err), 403));
			else res.send(utils.response(true, yc));
				// else cb();
			});
});


// 			router.post('/tho', function(req, res, next) {
// 	var body = req.body;
// 	console.log(body);
// 	var tho = new thomodel(body);
// 	tho.save(function(err) {
// 		if(err) res.send(utils.response(false, {}, utils.getErrorMessage(err), 403));
// 		else res.send(utils.response(true, {_id: tho._id}));
// 	});
// });

router.get('/yeucau', function(req, res, next) {
	yeucaumodel.find({}, function(err, data) {
		if (err)
			res.send(err);
		res.send(utils.response(true, data));
	})
});

router.get('/getid', function(req, res, next) {
	yeucaumodel.find({}, function(err, data) {
		if (err) {
			res.send(err);
		}
		if (data.length === 0) {
			res.send('YC001');
		} else {
			var lastID = data.slice(-1).pop().mayc;
			var index = parseInt(lastID.substring(2));
			index = index + 1;
			if (index < 10) {
				res.send(utils.response(true, "YC00" + index));
				// res.send();
			} else if (index < 100) {
				res.send(utils.response(true, "YC0" + index));
				// res.send("YC0"+index);
			} else if (index < 1000) {
				res.send(utils.response(true, "YC" + index));
				// res.send("YC"+index);
			}
		}
	})
})

router.get('/notification', function(req, res) {
	yeucaumodel.find({
		'trangthai': "Bắt đầu"
	}, function(err, data, next) {
		if (err)
			res.send(err);
		res.send(data);
	})
})

router.get('/notification/:cmnd', function(req, res) {
	yeucaumodel.find({
		'trangthai': "Bắt đầu",
		'cmndTho': req.params.cmnd
	}, function(err, data, next) {
		if (err)
			res.send(err);
		res.send(data);
	})
})

router.put('/yeucau/:id', function(req, res, next) {
	yeucaumodel.findOneAndUpdate({
		'_id': req.params.id
	}, req.body, function(err, data) {
		if (err)
			res.send(err);
		res.send(utils.response(true, data));
	})
});

router.delete('/yeucau/:mayc', function(req, res, next) {
	yeucaumodel.remove({
		'mayc': req.params.mayc
	}, function(err, result) {
		if (err)
			res.send(err);
		else
			res.send({
				messages: "Xóa thành công"
			});
	})
});

router.get('/yeucau/:mayc', function(req, res, next) {
	yeucaumodel.findOne({
		'mayc': req.params.mayc
	}, function(err, data) {
		if (err)
			res.send(err);
		res.send(utils.response(true, data));
	})
});

router.get('/yeucautho/:cmnd', function(req, res, next) {
	yeucaumodel.find({
		'cmndTho': req.params.cmnd
	}, function(err, data) {
		if (err)
			res.send(err);
		res.send(utils.response(true, data));
	})
});


router.get('/yeucaukhach/:sodt', function(req, res, next) {
	yeucaumodel.find({
		'sodt': req.params.sodt
	}, function(err, data) {
		if (err)
			res.send(err);
		res.send(utils.response(true, data));
	})
});

module.exports = router;