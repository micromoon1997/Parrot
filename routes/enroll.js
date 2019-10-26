const express = require('express');
const router = express.Router();

/* GET /enroll. */
router.get('/', function(req, res, next) {
  res.render('enroll');
});

module.exports = router;