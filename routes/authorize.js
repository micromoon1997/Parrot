const express = require('express');
const router = express.Router();
const authService = require('../services/outlook/auth');
const serverService = require('../services/server');

/* GET /authorization */
router.get('/', async function (req, res, next) {
  const OUTLOOK_AUTH_CODE = req.query.code;
  await authService.getTokenFromCode(OUTLOOK_AUTH_CODE);
  await serverService.checkServerStatus();
  res.render('index', {title: 'Authorization'});
});

module.exports = router;