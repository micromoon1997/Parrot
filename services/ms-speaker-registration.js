const AZURE_KEY = process.env["AZURE_COGNITIVE_KEY"];
const AZURE_ENDPOINT = process.env["AZURE_COGNITIVE_ENDPOINT"];
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const DBPassword = process.env["MONGO_DB_PASSWORD"]

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://project-parrot:"+ DBPassword +"@cluster0-518sn.azure.mongodb.net/test?retryWrites=true&w=majority";

let guid;
let operationUrl;

function createProfile() {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", AZURE_ENDPOINT + "/identificationProfiles");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", AZURE_KEY);
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
    
    xhr.open("POST", AZURE_ENDPOINT + '/identificationProfiles/' + guid + "/enroll");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", AZURE_KEY);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if(xhr.status === 202){
            operationUrl = xhr.getResponseHeader("Operation-Location");
            setTimeout(function() {
                //status check api call
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
        else{
            console.log(xhr.status);
            // console.log(xhr.responseText);
        }
    };
    xhr.send(blob.buffer);
}

function submit(data) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("test").collection("people");
        // perform actions on the collection object
        console.log(collection);
        client.close();
    });
}

module.exports = {
    createProfile: createProfile,
    createEnrollment: createEnrollment,
    submit: submit
};