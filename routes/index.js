const express = require('express');
const router = express.Router();
const authHelper = require('../services/auth');


/* GET home page. */
router.get('/', function (req, res, next) {
  let parms = {title: 'Home', active: {home: true}};
  // parms.signInUrl = authHelper.getAuthUrl();
  // parms.debug = parms.signInUrl;
  res.render('index', parms);
});

module.exports = router;
