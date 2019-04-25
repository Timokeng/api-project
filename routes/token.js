var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var URL = require('url');
var base = require('../base.js');
const sync_request = require('sync-request');

// 创建连接
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'forum'
});
connection.connect();

// 构造sql语句
var judgeSql = 'SELECT * FROM user_info WHERE openId=?';
var addSql = 'INSERT INTO user_info(token,openId,level) VALUE(?,?,1)';
var updateSql = 'UPDATE user_info SET token=? WHERE openId=?';

// 数据获取方法（Promise）
// ==判断是否已经注册
function judge(openId){
  return new Promise(function(resolve, reject){
    connection.query(judgeSql, [openId], function(err, result){
      if(err){
        reject(err);
      } else{
        if(result.length){
          resolve(true);
        } else{
          resolve(false);
        }
      }
    })
  })
}

// ==用户未注册则注册
function add(token, openId){
  return new Promise(function(resolve, reject){
    connection.query(addSql, [token, openId], function(err, result){
      if(err){
        reject(err);
      } else{
        resolve(0);
      }
    })
  })
}

// ==用户已注册则更新token
function update(token, openId){
  return new Promise(function(resolve, reject){
    connection.query(updateSql, [token, openId], function(err, result){
      if(err){
        reject(err);
      } else{
        resolve(1)
      }
    })
  })
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(404);
  res.send();
});

router.post('/', function(req, res, next) {
  var data = req.body;
  const appId = 'wx94f2bd29a57b7e2d';
  const appSecret = '8a67de3f04329cc915c44be984577f22';
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${data.wx_code}&grant_type=authorization_code`;
  const wx_res = sync_request('GET', url);
  var session = JSON.parse(wx_res.body);
  judge(session.openid).then(function(result){
    if(!result){
      return add(session.session_key, session.openid);
    } else{
      return update(session.session_key, session.openid);
    }
  }).then(function(result){
    res.send({
      code: 0,
      data: {
        token: session.session_key
      }
    })
  }).catch(function(err){
    base.sendErr(res, 2, err);
  })
})

module.exports = router;
