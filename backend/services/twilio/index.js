const makeCall = require('./make-call');
const fetchRecording = require('./fetch-recording');
const fetchRecordingSid = require('./fetch-recording-sid');
const storeRecording = require('./store-recording');
const updateDatabase = require('./update-database');

module.exports = {
    makeCall,
    fetchRecording,
    fetchRecordingSid,
    storeRecording,
    updateDatabase
};