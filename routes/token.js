var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(404);
  res.send();
});

router.post('/', function(req, res, next) {
  res.send({
    code: 0,
    data: {
      token: '201904192'
    }
  })
})

module.exports = router;
