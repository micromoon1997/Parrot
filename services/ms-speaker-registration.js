const AZURE_KEY = process.env["AZURE_COGNITIVE_KEY"];
const AZURE_ENDPOINT = process.env["AZURE_COGNITIVE_ENDPOINT"];

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const { getDatabase } = require('./database');

let guid;

async function getPersonName(profileId) {
    console.log(profileId);
    const db = getDatabase();
    const person = await db.collection('people').findOne({azureSpeakerRecognitionGuid: profileId});
    return `${person.firstName} ${person.lastName}`;
}

function createProfile(res) {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", AZURE_ENDPOINT + "/identificationProfiles");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", AZURE_KEY);
    xhr.send('{"locale":"en-us"}');
    xhr.onload = function() {
        if (this.readyState === 4 && xhr.status === 200){
            guid = JSON.parse(xhr.responseText).identificationProfileId;
            res.status(200).send();
        } else if (this.readyState === 4) {
            res.status(500).send("Failed to create profile");
        }
    }
}

function createEnrollment(blob, res) {
    let xhr = new XMLHttpRequest();
    
    xhr.open("POST", AZURE_ENDPOINT + '/identificationProfiles/' + guid + "/enroll");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", AZURE_KEY);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 202) {
            let operationUrl = xhr.getResponseHeader("Operation-Location");
            setTimeout(function() {
                // status check api call
                let xhrStatusCheck = new XMLHttpRequest();
                xhrStatusCheck.open("GET", operationUrl);
                xhrStatusCheck.setRequestHeader("Ocp-Apim-Subscription-Key", AZURE_KEY);
                xhrStatusCheck.send();
                xhrStatusCheck.onload = function(){
                    if(xhrStatusCheck.readyState === 4 && xhrStatusCheck.status === 200) {
                        // console.log(xhrStatusCheck.responseText);
                        res.status(200).send(xhrStatusCheck.responseText);
                    } else if (xhrStatusCheck.readyState === 4){
                        res.status(500).send(JSON.stringify({ "error": { "message": xhrStatusCheck.responseText } }));
                    }
                }
            }, 5000);
        }
        else if (xhr.readyState === 4) {
            res.status(500).send(xhr.responseText);
        }
    };
    xhr.send(blob.buffer);
}

function submit(data) {
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

module.exports = {
    createProfile: createProfile,
    createEnrollment: createEnrollment,
    submit: submit
};