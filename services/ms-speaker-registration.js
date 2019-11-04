const MS_API_KEY = process.env["MS_API_KEY"];
const MS_API_ENDPOINT = process.env["MS_API_ENDPOINT"]
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let guid;
let operationUrl;

function createProfile() {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", MS_API_ENDPOINT + "/identificationProfiles");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", MS_API_KEY);
    xhr.send('{"locale":"en-us"}');

    xhr.onload = function(e){
        if(this.readyState === 4 && xhr.status === 200){
            console.log("profile created");
            guid = JSON.parse(xhr.responseText).identificationProfileId;
        } else if (this.readyState === 4) {
            console.log("failed");
        }
    }
}

function createEnrollment(blob) {
    // let fd = new FormData();
    // fd.append("voice_sample", blob.buffer);

    let xhr = new XMLHttpRequest();
    console.log(blob.buffer);
    xhr.open("POST", MS_API_ENDPOINT + '/identificationProfiles/' + guid + "/enroll");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", key);
    xhr.send();

    xhr.onload = function (e) {
        if(this.readyState === 4 && xhr.status === 202) {
            operationUrl = xhr.getRequestHeader("Operation-Location");
            console.log(operationUrl);
        } else if (this.readyState === 4 ){
            console.log("failed enrollment");
        }
    }
}

module.exports = {
    createProfile: createProfile,
    createEnrollment: createEnrollment
};