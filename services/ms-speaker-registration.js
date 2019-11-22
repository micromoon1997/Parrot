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

async function createEnrollment(audioBlob, user_info, res) {
    let guid;
    const profile_options = {
        method: 'post',
        url: `${AZURE_ENDPOINT}/identificationProfiles`,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': AZURE_KEY
        },
        data: {
            'locale': 'en-us'
        }
    };
    axios(profile_options)
    .then((response) => {
        console.log(response.data);
        guid = response.data.identificationProfileId;
        const enroll_options = {
            method: 'post',
            url: `${AZURE_ENDPOINT}/identificationProfiles/${guid}/enroll`,
            data: audioBlob.buffer,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': AZURE_KEY
            }
        };
        return axios(enroll_options);
    })
    .then((response) => {
        const operationLocation = response.headers['operation-location'];
        schedule.scheduleJob(operationLocation, '*/5 * * * * *', async () => {
            console.log('waiting for operation status');
            const data = await getOperationStatus(operationLocation);
            console.log(data);
            if (data.status === 'succeeded') {
                console.log('succeeded');
                schedule.scheduledJobs[operationLocation].cancel();
                submit(user_info, guid);
                res.status(200).send(data);
            } else if (data.status === 'failed') {
                schedule.scheduledJobs[operationLocation].cancel();
                console.log(data);
                res.status(500).send(data);
            }
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
}

function submit(data, guid) {
    console.log(data);
    const db = getDatabase();
    try {
        db.collection('people').updateOne(
            { email: data.email },
            { $set: {
                email:data.email, 
                firstName: data.first_name,
                lastName: data.last_name,
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

async function tagTranscription(meetingId, profileIds, untaggedTranscription) {
    const promises = [];
    for (let i = 0; i < profileIds.length; i++) {
        if (untaggedTranscription.includes(`speaker${i + 1}`)) {
            promises.push(
                new Promise(async (resolve, reject) => {
                    const audioBlob = fs.readFileSync(`${__dirname}/transcribe/output/speaker${i + 1}.wav`);
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
                            console.log("Scheduling a job!!!\n");
                            const data = await getOperationStatus(operationLocation);
                            //console.log(data);
                            if (data.status === 'succeeded') {
                                schedule.scheduledJobs[operationLocation].cancel();
                                const personName = await getPersonName(data.processingResult.identifiedProfileId);
                                untaggedTranscription = untaggedTranscription.replace(new RegExp(`speaker${i + 1}`, 'g'), personName);
                                resolve();
                            }
                            if (data.status === 'failed') {
                                schedule.scheduledJobs[operationLocation].cancel();
                                reject();
                            }
                        });
                    } catch (err) {
                        console.log(`Fail to get who is speaking: ${err}`);
                    }
                })
            );
        }
    }
    Promise.all(promises).then(() => {
        fs.writeFileSync(`${__appRoot}/transcriptions/${meetingId}.txt`, untaggedTranscription);
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
    createEnrollment: createEnrollment,
    // submit: submit,
    tagTranscription: tagTranscription,
};