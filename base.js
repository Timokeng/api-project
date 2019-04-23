var mysql = require('mysql')

// 报错
function sendErr(res, code, err){
  if(code == 1){
    res.send({
      code: 1,
      data: {
        message: '参数错误'
      }
    });
    return;
  }
  if(code == 2){
    res.send({
      code: 2,
      data: {
        message: err.message
      }
    });
    return;
  }
  if(code == 3){
    res.send({
      code: 3,
      data: {
        message: '已无更多数据'
      }
    });
    return;
  }
  if(code == -999){
    res.send({
      code: -999,
      data: {
        message: '身份信息无效'
      }
    })
  }
}

// 根据token获取当前用户信息
function getCurUserInfo(req, res, next){
  // 现在测试阶段暂不使用 var token = req.get('Authorization');
  var token = '201904192';
  if(!token){
    sendErr(-999);
    return;
  }

  // 与数据库创建连接
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'forum'
  });
  connection.connect();

  var sql = 'SELECT * FROM user_info WHERE token=?'

  connection.query(sql, [token], function(err, result){
    if(err){
      sendErr(res, 2, err);
    } else{
      if(result.length){
        global.userInfo = result[0];
        next();
      } else{
        sendErr(-999);
      }
    }
    connection.end();
  })
}

module.exports = {
    sendErr,
    getCurUserInfo
}