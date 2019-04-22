var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var URL = require('url');
var base = require('../base.js')

// 创建连接
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'forum'
});
connection.connect();

// 构造sql语句
var sql = 'SELECT id,title,lastModified FROM posts WHERE userId=? ORDER BY lastModified desc';

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = URL.parse(req.url, true).query;
  if(params.page < 1 || !params.page){
    base.sendErr(res, 1);
  } else{
    connection.query(sql, [global.userInfo.id], function(err, result){
      if(err){
        base.sendErr(res, 2, err);
      } else{
        var list = result.slice((params.page - 1) * 10, params.page * 10);
        if(list.length){
          var re = [];
          for(let i = 0; i < list.length; i++){
            re.push({
              id: list[i].id,
              userImg: global.userInfo.avatarUrl,
              userName: global.userInfo.nickName,
              title: list[i].title,
              lastModified: list[i].lastModified
            });
          }
          res.send({
            code: 0,
            data: {
              list: re
            }
          });
        } else{
          base.sendErr(res, 3);
        }
      }
    })
  }
});

module.exports = router;
