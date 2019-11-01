const express = require('express');
const router = express.Router();
const { getDatabase }= require('../services/database');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const db = getDatabase();
  const a = await db.collection('meetings').findOne({ code: '0001' }, { changeKey: 1 });
  console.log(a);
  res.send('respond with a resource');
});

module.exports = router;
