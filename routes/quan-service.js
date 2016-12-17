var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var quan = require('../model/quan');
var utils = require('../utils/utils');

var quanmodel = mongoose.model('quan');

/* GET users listing. */
quan.methods(['put','post','delete']);
quan.register(router,'/quan'); 

router.get('/quan', function(req, res, next) {
	quanmodel.find({}, function(err, data) {
		if(err)
			res.send(err);
		else
			res.send(utils.response(true, data));
	})
});
module.exports = router;