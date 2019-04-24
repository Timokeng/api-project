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
var setReviewSql = 'INSERT INTO reply1(parentId,userImg,userName,message) VALUE(?,?,?,?)';
var setChildReviewSql = 'INSERT INTO reply2(parentId,userName,message) VALUE(?,?,?)';
var changeLastModifiedSql = 'UPDATE posts SET lastModified=? WHERE id=?';

// 数据获取方法（Promise）
// ==发表回复
function setReview(id, message){
  return new Promise(function(resolve, reject){
    var params = [id, global.userInfo.avatarUrl, global.userInfo.nickName, message];
    connection.query(setReviewSql, params, function(err, result){
      if(err){
        reject(err);
      } else{
        resolve();
      }
    })
  })
}

// ==发表子回复
function setChildReview(id, message){
  return new Promise(function(resolve, reject){
    var params = [id, global.userInfo.nickName, message];
    connection.query(setChildReviewSql, params, function(err, result){
      if(err){
        reject(err);
      } else{
        resolve();
      }
    })
  })
}

// ==修改最后修改时间
function changeLastModified(id){
  return new Promise(function(resolve, reject){
    var date = new Date();
    connection.query(changeLastModifiedSql, [date,id], function(err, result){
      if(err){
        reject(err);
      } else{
        resolve();
      }
    })
  })
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(404);
  res.send();
});

/* POST users listing */
router.post('/', function(req, res, next) {
  console.log(data);
  // 参数错误
  if(!data){
    base.sendErr(res, 1);
    return;
  }
  if(data.pos == -1){
    setReview(data.id, data.str).then(changeLastModified(data.id)).then(function(result){
      res.send({
        code: 0,
        data: {
          message: '评论成功'
        }
      })
    }).catch(function(err){
      base.sendErr(res, 2, err);
    })
  } else{
    setChildReview(data.pos, data.str).then(changeLastModified(data.id)).then(function(result){
      res.send({
        code: 0,
        data: {
          message: '评论成功'
        }
      })
    }).catch(function(err){
      base.sendErr(res, 2, err);
    })
  }
})

module.exports = router;
