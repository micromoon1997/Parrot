const express = require('express');
const router = express.Router();
const registration = require('../services/ms-speaker-registration.js');

router.post('/', function(req, res, next) {
    try{
        registration.submit(req.body);
        res.sendStatus(200);
    } catch(err){
        res.sendStatus(500);
    }
});

module.exports = router;