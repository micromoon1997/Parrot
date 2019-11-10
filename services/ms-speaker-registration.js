const AZURE_KEY = process.env["AZURE_COGNITIVE_KEY"];
const AZURE_ENDPOINT = process.env["AZURE_COGNITIVE_ENDPOINT"];
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const axios = require('axios');
const schedule = require('node-schedule');
const fs = require('fs');
const { getDatabase } = require('../services/database');

let guid;
let operationUrl;

async function getPersonName(profileId) {
    const db = getDatabase();
    const person = await db.collection('people').findOne({azureSpeakerRecognitionGuid: profileId});
    return `${person.firstName} ${person.lastName}`;
}

function createProfile() {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", AZURE_ENDPOINT + "/identificationProfiles");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", AZURE_KEY);
    xhr.send('{"locale":"en-us"}');

    xhr.onload = function (e) {
        if (this.readyState === 4 && xhr.status === 200) {
            console.log("profile created");
            guid = JSON.parse(xhr.responseText).identificationProfileId;
        } else if (this.readyState === 4) {
            console.log(xhr.statusText);
        }
    }
}

function createEnrollment(blob, res) {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", AZURE_ENDPOINT + '/identificationProfiles/' + guid + "/enroll");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", AZURE_KEY);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 202) {
            operationUrl = xhr.getResponseHeader("Operation-Location");
            setTimeout(function () {
                //status check api call
                let xhrStatusCheck = new XMLHttpRequest();
                xhrStatusCheck.open("GET", operationUrl);
                xhrStatusCheck.setRequestHeader("Ocp-Apim-Subscription-Key", AZURE_KEY);
                xhrStatusCheck.send();
                xhrStatusCheck.onload = function () {
                    if (xhrStatusCheck.readyState === 4 && xhrStatusCheck.status === 200) {
                        res.send(xhrStatusCheck.responseText);
                    } else {
                        console.log(xhrStatusCheck.statusText);
                    }
                }
            }, 5000);
        } else {
            console.log(xhr.status);
            // console.log(xhr.responseText);
        }
    };
    xhr.send(blob.buffer);
}

async function tagTranscription(meetingId, profileIds, untaggedTranscription) {
    console.log(profileIds.join());
    const promises = [];
    for (let i=0; i < profileIds.length; i++) {
        if (untaggedTranscription.includes(`speaker${i+1}`)) {
            promises.push(
                new Promise(async (resolve, reject) => {
                    const audioBlob = fs.readFileSync(`${__dirname}/transcribe/output/speaker${i+1}.wav`);
                    const options = {
                        method: 'post',
                        url: AZURE_ENDPOINT + `/identify?identificationProfileIds=${profileIds.join()}`,
                        data: audioBlob,
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Ocp-Apim-Subscription-Key': AZURE_KEY
                        }
                    };
                    try {
                        const response = await axios(options);
                        const operationLocation = response.headers['operation-location'];
                        console.log(operationLocation);
                        schedule.scheduleJob(operationLocation, '*/5 * * * * *', async () => {
                            console.log("Scheduling a job!!!\n");
                            const data = await getOperationStatus(operationLocation);
                            //console.log(data);
                            if (data.status === 'succeeded') {
                                schedule.scheduledJobs[operationLocation].cancel();
                                const personName = await getPersonName(data.processingResult.identifiedProfileId);
                                console.log(personName);
                                untaggedTranscription = untaggedTranscription.replace(new RegExp(`speaker${i+1}`, 'g'), personName);
                                resolve();
                            }
                            if (data.status === 'failed') {
                                schedule.scheduledJobs[operationLocation].cancel();
                                reject();
                            }
                        });
                    } catch (err) {
                        console.log(`Fail to get who is speaking:${err}`);
                    }
                })
            );
        }
    }
    Promise.all(promises).then(() => {
        fs.writeFileSync(`${__dirname}/transcribe/output/${meetingId}.txt`, untaggedTranscription);
    }).catch((err) => {
        console.log(err);
    });
}

async function getOperationStatus(location) {
    const options = {
        method: 'get',
        url: location,
        headers: {
            'Ocp-Apim-Subscription-Key': AZURE_KEY
        }
    };
    try {
        const response = await axios(options);
        return response.data;
    } catch (err) {
        console.log("Fail to get operation status.\n");
        console.log(err);
    }
}

async function getProfile(profileId) {
    const options = {
        method: 'get',
        url: AZURE_ENDPOINT + `/identificationProfiles/${profileId}`,
        headers: {
            'Ocp-Apim-Subscription-Key': AZURE_KEY
        }
    };
    try {
        const response = await axios(options);
        console.log(response.data);
    } catch (err) {
        console.log("Fail to get profile.\n");
        console.log(err);
    }
}

module.exports = {
    createProfile: createProfile,
    createEnrollment: createEnrollment,
    tagTranscription: tagTranscription,
    getProfile: getProfile
};