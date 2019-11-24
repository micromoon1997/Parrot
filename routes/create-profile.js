const express = require('express');
const router = express.Router();
const registration = require('../services/ms-speaker-registration.js');

router.post('/', async function(req, res, next) {
    try {
        const guid = await registration.createProfile();
        res.status(200).send(guid);
    } catch (err) {
        console.log('Fail to create profile:');
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;