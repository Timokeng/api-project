var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('/last-job/api-project/views/test.html')
});

module.exports = router;
