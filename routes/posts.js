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
var sql = 'SELECT * FROM posts ORDER BY lastModified desc';
var getUserSql = 'SELECT * FROM user_info WHERE id=?'

// 数据获取方法（Promise）
// ==获取帖子列表
function getPosts(res, page){
  return new Promise(function(resolve, reject){
    connection.query(sql, function(err, result){
      if(err){
        base.sendErr(res, 2, err);
        reject()
        return;
      }
      var list = result.slice((page - 1) * 10, (page * 10));
      if(list.length){
        resolve(list);
      } else{
        base.sendErr(res, 3);
        reject();
      }
    })
  })
}

// ==获取用户信息
function getUserInfo(res, postInfo){
  return new Promise(function(resolve, reject){
    connection.query(getUserSql, [postInfo.userId], function(err, result){
      if(err){
        console.log(err);
        reject();
      } else{
        if(result.length){
          var data = {
            id: postInfo.id,
            userImg: result[0].avatarUrl,
            userName: result[0].nickName,
            title: postInfo.title,
            message: postInfo.message,
            lastModified: postInfo.lastModified
          };
          resolve(data);
        } else{
          console.log('用户信息无效')
          reject();
        }
      }
    })
  })
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = URL.parse(req.url, true).query;
  // 参数错误返回结果
  if(params.page < 1 || !params.page){
    base.sendErr(res, 1);
  } else{
    getPosts(res, params.page).then(function(result){
      var list = [];
      for(let i = 0; i < result.length; i++){
        list.push(getUserInfo(res, result[i]));
      }
      Promise.all(list).then(function(resu){
        res.send({
          code: 0,
          data: {
            list: resu
          }
        })
      })
    })
  }
});

module.exports = router;
