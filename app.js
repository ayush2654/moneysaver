var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var about = require('./routes/about');
var newuser = require('./routes/newuser');
var login = require('./routes/login');
var app = express();
var mysql = require('mariasql');
var parser = bodyParser.urlencoded({extended : false});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//setting mysql connection
var con = mysql.createConnection({
  host:'127.0.0.1',
  user:'root',
  password:'ayush123'
});

con.connect(function(err){
  if(err) console.log("not connected");
  else console.log("connected");

  con.query("create database mydb", function (err, result) {
    if (err) console.log("not found");
    else console.log("databse created");
  });
});

app.use('/', index);  //home
app.use('/users', users);    //users
app.use('/about',about);
app.use('/newuser',newuser);
app.use('/login',login);

app.post('/myaction-1', parser, function(req, res) {
    console.log(req.body.firstname);                                      // function to retrieve data from the html page
    res.render('about');      //jade file name
});

app.post('/myaction-2',parser,function(req,res){
  console.log(req.body);
  res.render('about');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
