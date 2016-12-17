exports.response = function(success, data, message, statusCode) {
	return {
		success: success,
		code: statusCode ? statusCode : 200,
		message: message ? message : 'Successfully',
		results: data ? data : {}
	};
};

/* Get message in error */
exports.getErrorMessage = function(err) {
	var errText = '';

	if (!err) errText = 'Server error';
	else if (err.errors) {
		var value = Object.keys(err.errors)[0];
		errText = err.errors[value] ? err.errors[value].message : 'Server error';
	} else errText = err.message

	return errText;
};

/* Get last message in data */
exports.getLastMessage = function(data) {
  var keys = Object.keys(data);
  var last = keys[keys.length - 1];
  return data[last];
};