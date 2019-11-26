const AZURE_KEY = process.env["AZURE_COGNITIVE_KEY"];
const AZURE_ENDPOINT = process.env["AZURE_COGNITIVE_ENDPOINT"];

const axios = require('axios');
const schedule = require('node-schedule');
const fs = require('fs');
const { getDatabase } = require('./database');

async function getPersonName(profileId) {
    console.log(profileId);
    const db = getDatabase();
    const person = await db.collection('people').findOne({azureSpeakerRecognitionGuid: profileId});
    if (person) {
        return `${person.firstName} ${person.lastName}`;
    } else {
        return 'Unknown';
    }
}

async function createProfile() {
    const options = {
        method: 'post',
        url: `${AZURE_ENDPOINT}/identificationProfiles`,
        data: {
            locale: 'en-us'
        },
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': AZURE_KEY
        }
    };
    const response = await axios(options);
    return response.data.identificationProfileId;
}

async function createEnrollment(audioBlob, guid, res) {
    const options = {
        method: 'post',
        url: `${AZURE_ENDPOINT}/identificationProfiles/${guid}/enroll`,
        data: audioBlob.buffer,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': AZURE_KEY
        }
    };
    try {
        const response = await axios(options);
        const operationLocation = response.headers['operation-location'];
        schedule.scheduleJob(operationLocation, '*/5 * * * * *', async () => {
            const data = await getOperationStatus(operationLocation);
            if (data.status === 'succeeded') {
                console.log('succeeded');
                schedule.scheduledJobs[operationLocation].cancel();
                res.status(200).send(data);
            } else if (data.status === 'failed') {
                schedule.scheduledJobs[operationLocation].cancel();
                console.log(data);
                res.status(500).send(data.message);
            }
        });
    } catch (err) {
        console.log('Fail to create enrollment file:');
        console.log(err.response.data);
        res.status(500).send(err.response.data.error.message);
    }
}

function submit(data, guid) {
    const db = getDatabase();
    try {
        db.collection('people').updateOne(
            { email: data.email },
            { $set: {
                email:data.email, 
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: null,
                azureSpeakerRecognitionGuid: guid
            } },
            {
                upsert: true
            }
        )
    } catch(err) {
        console.error("Failed to update database with error: " + err);
    }
}

async function tagTranscription(meetingId, profileIds, transcription) {
    const promises = [];
    for (let i = 0; i < profileIds.length; i++) {
        if (transcription.includes(`speaker${i + 1}`)) {
            promises.push(
                new Promise(async (resolve, reject) => {
                    const audioBlob = fs.readFileSync(`${__appRoot}/tmp/speaker${i + 1}.wav`);
                    const options = {
                        method: 'post',
                        url: AZURE_ENDPOINT + `/identify?identificationProfileIds=${profileIds.join()}&shortAudio=true`,
                        data: audioBlob,
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Ocp-Apim-Subscription-Key': AZURE_KEY
                        }
                    };
                    try {
                        const response = await axios(options);
                        const operationLocation = response.headers['operation-location'];
                        schedule.scheduleJob(operationLocation, '*/5 * * * * *', async () => {
                            const data = await getOperationStatus(operationLocation);
                            //console.log(data);
                            if (data.status === 'succeeded') {
                                schedule.scheduledJobs[operationLocation].cancel();
                                const personName = await getPersonName(data.processingResult.identifiedProfileId);
                                transcription = transcription.replace(new RegExp(`speaker${i + 1}`, 'g'), personName);
                                resolve();
                            }
                            if (data.status === 'failed') {
                                schedule.scheduledJobs[operationLocation].cancel();
                                reject();
                            }
                        });
                    } catch (err) {
                        console.log('Fail to get who is speaking:');
                        console.log(err.response.data);
                    }
                })
            );
        }
    }
    return Promise.all(promises).then(() => {
        fs.writeFileSync(`${__appRoot}/transcriptions/${meetingId}.txt`, transcription);
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

module.exports = {
    createProfile: createProfile,
    createEnrollment: createEnrollment,
    submit: submit,
    tagTranscription: tagTranscription,
};