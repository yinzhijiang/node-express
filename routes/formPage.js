var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/formPage', function(req, res, next) {
  res.render('formPage');
});

module.exports = router;
