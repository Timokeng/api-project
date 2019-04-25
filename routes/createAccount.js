var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var URL = require('url');
var base = require('../base.js');

// 创建连接
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'forum'
});
connection.connect();

// 构造sql语句
var sql = 'UPDATE user_info SET nickName=?,avatarUrl=? WHERE token=?';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(404);
  res.send();
});

router.post('/', function(req, res, next){
  var data = req.body;
  var token = req.get('Authorization');
  connection.query(sql, [data.nickName, data.avatarUrl, token], function(err, result){
    if(err){
      base.sendErr(res, 2, err);
    } else{
      res.send({
        code: 0,
        data: {
          level: global.userInfo.level,
          message: '用户信息已录入'
        }
      })
    }
  })
})

module.exports = router;
