var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var index = require('./routes/index');
var mongoose = require('./connect/connect-mongodb');

mongoose.connect;

var app = express();
var router = express.Router();

// view engine setup
app.set('app', path.join(__dirname, 'app'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/',require('./routes/tho-service'));
app.use('/',require('./routes/yeucau-service'));
app.use('/',require('./routes/dichvu-service'));
app.use('/',require('./routes/quan-service'));
app.use('/',require('./routes/user-service'));
app.use('/',require('./routes/khachhang-service'));
app.use('/',require('./routes/lichbantho-service'));
app.use('/',require('./routes/lichlamviectho-service'));

app.use('/favicon.ico',function(req,res,next){
    res.end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        return res.status(404).json({
            stastusCode: 404,
            success: false,
            message: err.message,
            data: {}
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    if (err.constructor.name === 'UnauthorizeError') {
        return res.status(401).jsonp({
            stastusCode: 401,
            success: false,
            message: err.message,
            data: {}
        });
    }
    return res.status(err.status || 500).jsonp({
        stastusCode: err.status || 500,
        success: false,
        message: 'Server error',
        data: {}
    });
});


module.exports = app;
