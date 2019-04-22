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
var getCollectListSql = 'SELECT * FROM collect WHERE userId=? ORDER BY id desc';
var getUserInfoSql = 'SELECT nickName,avatarUrl FROM user_info WHERE id=?';
var getPostInfoSql = 'SELECT title,lastModified FROM posts WHERE id=?';

// 数据获取方法（Promise）
// ==获取已收藏列表
function getCollectList(res, id, page){
  return new Promise(function(resolve, reject){
    connection.query(getCollectListSql, [id], function(err, result){
      if(err){
        base.sendErr(res, 2, err);
        reject();
      } else{
        list = result.slice((page - 1) * 10, page * 10);
        if(list.length){
          resolve(list);
        } else{
          base.sendErr(res, 3);
          reject();
        }
      }
    })
  })
}

// ==获取用户信息
function getUserInfo(res, data){
  return new Promise(function(resolve, reject){
    connection.query(getUserInfoSql, [data.userId], function(err, result){
      if(err){
        console.log(err);
        reject();
      } else{
        if(result.length){
          data.userInfo = result[0];
          resolve(data);
        } else{
          console.log('用户信息无效')
          reject();
        }
      }
    })
  })
}

// ==获取帖子详细信息
function getPostInfo(res, data){
  return new Promise(function(resolve, reject){
    connection.query(getPostInfoSql, [data.postId], function(err, result){
      if(err){
        console.log(err);
        reject();
      } else{
        if(result.length){
          data.postInfo = result[0];
          resolve(data);
        } else{
          console.log('帖子已不存在')
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
    getCollectList(res, global.userInfo.id, params.page).then(function(result){
      var list = [];
      for(let i = 0; i < result.length; i++){
        list.push(getUserInfo(res, result[i]));
      }
      return new Promise(function(resolve, reject){
        Promise.all(list).then(function(resu){
          resolve(resu)
        })
      })
    }).then(function(result){
      var list = [];
      for(let i = 0; i < result.length; i++){
        list.push(getPostInfo(res, result[i]));
      }
      return new Promise(function(resolve, reject){
        Promise.all(list).then(function(resu){
          resolve(resu)
        })
      })
    }).then(function(result){
      var list = [];
      for(let i = 0; i < result.length; i++){
        data = {
          id: result[i].postId,
          userImg: result[i].userInfo.avatarUrl,
          userName: result[i].userInfo.nickName,
          title: result[i].postInfo.title,
          lastModified: result[i].postInfo.lastModified
        }
        list.push(data);
      }
      res.send({
        code: 0,
        data: {
          list: list
        }
      })
    })
  }
});

module.exports = router;
