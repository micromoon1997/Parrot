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
            console.log(xhr.statusText);
        }
    }
}

function createEnrollment(blob, res) {
    let xhr = new XMLHttpRequest();
    
    xhr.open("POST", MS_API_ENDPOINT + '/identificationProfiles/' + guid + "/enroll");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", MS_API_KEY);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if(xhr.status === 202){
            operationUrl = xhr.getResponseHeader("Operation-Location");
            setTimeout(function() {
                //status check api call
                let xhrStatusCheck = new XMLHttpRequest();
                xhrStatusCheck.open("GET", operationUrl);
                xhrStatusCheck.setRequestHeader("Ocp-Apim-Subscription-Key", MS_API_KEY);
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
        else{
            console.log(xhr.status);
            // console.log(xhr.responseText);
        }
    }
    xhr.send(blob.buffer);
}

module.exports = {
    createProfile: createProfile,
    createEnrollment: createEnrollment
};