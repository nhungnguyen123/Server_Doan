var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var dichvu = require('../model/dichvu');
var utils = require('../utils/utils');

var dichvumodel = mongoose.model('dichvu');

/* GET users listing. */
dichvu.methods(['post']);
dichvu.register(router,'/dichvu'); 

router.get('/dichvu', function(req, res, next) {
	dichvumodel.find({}, function(err, data) {
		if(err)
			res.send(err);
		else
			res.send(utils.response(true, data));
	})
});

router.get('dichvu/:id', function(req, res, next) {
	dichvumodel.findOne({'_id': req.param.id}, function(err, data) {
		if(err)
			res.send(err);
		else
			res.send(utils.response(true, data));
	})
});

router.put('dichvu/:id', function(req, res, next) {
	dichvumodel.findOneAndUpdate({'_id': req.param.id}, req.body, function(err, data) {
		if(err)
			res.send(err);
		else
			res.send(utils.response(true, data));
	})
});

router.delete('dichvu/:id', function(req, res, next) {
	dichvumodel.remove({'_id': req.param.id}, function(err, data) {
		if(err)
			res.send(err);
		else
			res.send(utils.response(true, data));
	})
});

module.exports = router;