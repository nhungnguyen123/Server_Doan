var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = require('../model/user');
var utils = require('../utils/utils');
var async = require('async');
var usermodel = mongoose.model('user', user);


/* GET users listing. */
user.register(router, '/user');

router.post('/login', function(req, res, next) {
	var username = req.body.username ? req.body.username.toString() : '';
	var password = req.body.password ? req.body.password.toString() : '';

	var user;
	console.log(req.body.username);

	async.series({
		// find user in database. Username can be phone number or email
		findUser: function(cb) {
			usermodel.findOne({
				username: username
			}, function(err, result) {
				console.log(result)
				if (err) return cb(true, utils.getErrorMessage(err));
				if (result) {
					user = result;
					return cb();
				}else{
					cb(true, 'Incorrect username or password');
				}
			});
		},
		validatePassword: function(cb) {
			cb(!user.xacthuc(password), 'Incorrect username or password');
		}
	}, function(err, results) {
		if (err) {
			res.jsonp(utils.response(false, {}, utils.getLastMessage(results)));
		} else {
			delete user.password;
			res.jsonp(utils.response(true, user));
		}
	});
});


router.put('/user/:cmnd', function(req, res, next) {
	usermodel.update({
		'cmnd': req.params.cmnd
	}, req.body, function (err, data) {
		if (err)
			res.send(err);
		else
			res.jsonp(utils.response(true, "Success"));
	})
})



module.exports = router;