const AZURE_KEY = process.env["AZURE_COGNITIVE_KEY"];
const AZURE_ENDPOINT = process.env["AZURE_COGNITIVE_ENDPOINT"];

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const { getDatabase } = require('./database');

let guid;
let operationUrl;

function createProfile() {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", AZURE_ENDPOINT + "/identificationProfiles");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", AZURE_KEY);
    xhr.send('{"locale":"en-us"}');
    xhr.onload = function(){
        try {
            if (this.readyState === 4 && xhr.status === 200){
                console.log("profile created");
                guid = JSON.parse(xhr.responseText).identificationProfileId;
            } else if (this.readyState === 4) {
                console.log(xhr.statusText);
            }
        } catch(err) {
            console.log("Failed to create profile with error: " + err)
        }
    }
}

function createEnrollment(blob, res) {
    let xhr = new XMLHttpRequest();
    
    xhr.open("POST", AZURE_ENDPOINT + '/identificationProfiles/' + guid + "/enroll");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", AZURE_KEY);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        try {
            if (xhr.status === 202){
                operationUrl = xhr.getResponseHeader("Operation-Location");
                setTimeout(function() {
                    // status check api call
                    let xhrStatusCheck = new XMLHttpRequest();
                    xhrStatusCheck.open("GET", operationUrl);
                    xhrStatusCheck.setRequestHeader("Ocp-Apim-Subscription-Key", AZURE_KEY);
                    xhrStatusCheck.send();
                    xhrStatusCheck.onload = function(){
                        if(xhrStatusCheck.readyState === 4 && xhrStatusCheck.status === 200){
                            res.send(xhrStatusCheck.responseText);   
                        } else {
                            console.log(xhrStatusCheck.statusText);
                        }
                    }
                }, 5000);
            }
            else {
                console.log(xhr.status);
            }
        } catch(err) {
            console.log("Failed to create enrollment with error: " + err)
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