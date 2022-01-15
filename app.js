var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');
var formPage = require('./routes/formPage');
var login = require('./routes/login');

var fs = require('fs');
var app = express();

// view engine setup
// 定义views，至根路径的views目录
//定义使用ejs模板引擎开发
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', login);
app.use('/users', usersRouter);
app.use('/formPage', formPage);

// 用户登录
app.post('/login', function (req, res) {
    debugger
    var response = {
        "name":req.body.name,
        "password":req.body.password,
    };
    console.log(response, ';response')
    fs.readFile(__dirname + '/users.json', 'utf8', function (err, data) {
        if(!err){
            let flag = false
            let obj = JSON.parse(data)
            obj.map(ele => {
                if (ele.name===response.name&&ele.password===response.password){
                    flag = true
                }
            })
            console.log(flag, 'flage')
            if(flag){
                res.end(JSON.stringify( '成功！' ));
            }else{
                res.render('error', status);
            }
        }else{
            throw err;
        }
    })
})
// 查询用户列表
app.get('/userList', function (req, res) {
    fs.readFile(__dirname + '/users.json', 'utf8', function (err, data) {
        if(!err){
            let obj = JSON.parse(data)
            let nameList = obj.map(ele => {
               return ele.name
            })
            console.log('查询成功！', nameList)
            res.render(__dirname + '/views/userList', { title: '查询用户列表:', users: obj });
        }else{
            throw err;
        }
    })
})
// 增加用户
app.post('/add_post', function (req, res) {
  // 输出 JSON 格式
  let ids =  new Date().getTime()+''
  console.log(ids)
  var response = {
      "name":req.body.name,
      "password":req.body.password,
      "id": ids,
  };
   fs.readFile(__dirname + '/users.json', 'utf8', function (err, data) {
        if(!err){
            let obj = JSON.parse(data)
            obj.push(response)
            console.log('增加用户成功！',obj)
            fs.writeFile(__dirname + '/users.json', JSON.stringify(obj), function (err) {
                if(!err){
                    res.end(JSON.stringify( '写入成功！' ));
                }else{
                    throw err;
                }
            })
        }else{
            throw err;
        }
       
    })
})

// 删除用户
app.post('/deleteUser', function (req, res) {
    // 输出 JSON 格式
    var response = {
        "id":req.body.id,
    };
    fs.readFile(__dirname + '/users.json', 'utf8', function (err, data) {
    if(!err){
            let obj = JSON.parse(data)
            obj.map(ele => {
                if(ele.id == response.id){
                obj.splice(ele, 1)
                }
            })
            fs.writeFile(__dirname + '/users.json', JSON.stringify(obj), function (err) {
                if(!err){
                    res.end(JSON.stringify( '写入成功！' ));
                }else{
                    throw err;
                }
            })
        }else{
            throw err;
        }
    })
})

// 修改用户
app.post('/updateUser', function (req, res) {
    // 输出 JSON 格式
    console.log(req.body)
    var response = {
        "id":req.body.id,
        "name":req.body.name,
        "password":req.body.password,
    };
    fs.readFile(__dirname + '/users.json', 'utf8', function (err, data) {
    if(!err){
            let obj = JSON.parse(data)
            obj.map(ele => {
                if(ele.id == response.id){
                   ele.name = response.name
                   ele.password = response.password
                }
            })
            console.log(obj, 'obj')
            fs.writeFile(__dirname + '/users.json', JSON.stringify(obj), function (err) {
                if(!err){
                    res.end(JSON.stringify( '写入成功！' ));
                }else{
                    throw err;
                }
            })
        }else{
            throw err;
        }
    })
})

app.post('/file_upload', function (req, res) {
  // var des_file = __dirname + "/" + req.files;
  res.end(JSON.stringify(req));
  //  fs.readFile( req.files[0].path, function (err, data) {
  //       fs.writeFile(des_file, data, function (err) {
  //        if( err ){
  //             console.log( err );
  //        }else{
  //              response = {
  //                  message:'File uploaded successfully', 
  //                  filename:req.files[0].originalname
  //             };
  //         }
  //         console.log( response );
  //         res.end( JSON.stringify( response ) );
  //      });
  //  });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
