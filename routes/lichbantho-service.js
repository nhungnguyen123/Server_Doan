var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var lichbantho = require('../model/lichban-tho');
var utils = require('../utils/utils');

var lichbanthomodel = mongoose.model('lichbantho');

/* GET users listing. */
lichbantho.methods(['post']);
lichbantho.register(router,'/lichbantho'); 

router.get('/lichbantho', function(req, res, next) {
	lichbanthomodel.find({}, function(err, data) {
		if(err)
			res.send(err);
		else
			res.send(utils.response(true, data));
	})
});

router.get('/lichbantho/:id', function(req, res, next) {
	lichbanthomodel.findOne({'_id': req.params.id}, function(err, data) {
		if(err)
			res.send(err);
		else
			res.send(utils.response(true, data));
	})
});

router.put('/lichbantho/:id', function(req, res, next) {
	lichbanthomodel.update({'_id': req.params.id}, req.body, function(err, data) {
		if(err)
			res.send(err);
		else 
			res.send(utils.response(true, data));
	})
});

router.delete('/lichbantho/:id', function(req, res, next) {
	lichbanthomodel.remove({'_id': req.params.id}, function(err, data) {
		if(err)
			res.send(err);
		else
			res.send(utils.response(true, data));
	})
});

module.exports = router;