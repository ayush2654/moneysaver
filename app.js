var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var about = require('./routes/about');
var newuser = require('./routes/newuser');
var login = require('./routes/login');
var profile = require('./routes/profile');
var app = express();
var mysql = require('mysql');
var dialog=require('dialog');
var parser = bodyParser.urlencoded({extended : false});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//setting mysql connection
var con =mysql.createConnection({
  host : 'localhost',
  password:'ayush123',
  user: 'root',
  database :'app_website'
});

con.connect(function(err){
  if(err) console.log(err);
  else console.log("connected");
});


app.use('/', index);  //home
app.use('/users', users);    //users
app.use('/about',about);
app.use('/newuser',newuser);
app.use('/login',login);
app.use('/profile',profile);

app.post('/myaction-1', parser, function(req, res)
{
  sql = "select username from contact where username='"+req.body.username+"'";
    console.log(req.body);
  con.query(sql,function(err,result)
  {
  if(err) console.log("some error occured");
  else if(result.length!=0)
  {
    console.log('username already exists');
    console.log(result);
  }
  else
  {
    var sql1 = "insert into contact(phone,password,email,username) values ('"+req.body.phone+"','"+req.body.password+"','"+req.body.email+"','"+req.body.username+"')";
    var sql2 = "insert into address(street,zipcode,city,country,username) values ('"+req.body.street+"','"+req.body.zipcode+"','"+req.body.city+"','"+req.body.country+"','"+req.body.username+"')";
    var sql3 = "insert into person(firstname,lastname,gender,dob,username) values ('"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.gender+"','"+req.body.dob+"','"+req.body.username+"')";
    push(sql1); push(sql2); push(sql3);
    console.log('info is pushed !!');
    res.render('about');
  }
});
});

function push(s)
{
  con.query(s,function(result){});
}

app.post('/myaction-2',parser,function(req,res)
{
  //console.log(req.body);
  sql = "select * from contact where username='"+req.body.username+"' and password='"+req.body.password+"'";
  con.query(sql, function (err, rows,fields) {
    if (err) console.log(err);
    else if(rows.length!=0)
    {
      console.log(rows);
      con.query("select * from address",function(err,add){
      con.query("select * from person",function(err,result)
      {
      res.render('profile',{ title:'profile',rows:rows,result:result,add:add});
      });
    });
    }
    else console.log('Please enter right password');
  });
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
