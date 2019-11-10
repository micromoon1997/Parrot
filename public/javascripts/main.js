window.navigator = window.navigator || {};

let audioContext = window.AudioContext || window.webkitAudioContext;
let gumStream;
let rec;
let input;

// everyone should set this to their own ngrok address
const SERVER_ADDRESS = "http://localhost:3000";

let createButton = document.getElementById("create_profile");
createButton.addEventListener("click", createProfile);
let recordButton = document.getElementById("record");
recordButton.addEventListener("click", startRecording);
let stopButton = document.getElementById("stop");
stopButton.addEventListener("click", stopRecording);

let moreAudio = document.getElementById("more_audio");
let enrollSuccess = document.getElementById("success");

let submitButton = document.getElementById('submit');
submitButton.addEventListener("click", submit);
let recording = document.getElementById("recording");

function startRecording() {
    console.log("record button clicked");
    let options = { audio: true };
    recordButton.disabled = true;
    stopButton.disabled = false;
    navigator.mediaDevices.getUserMedia(options).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
        let ac = new audioContext({sampleRate:16000});
        gumStream = stream;
        input = ac.createMediaStreamSource(stream);
        rec = new Recorder(input, { numChannels: 1 });
        rec.record();
        recording.hidden = false;
        console.log("Recording started...");
    }).catch(function (err) {
        console.log(err.message);
        alert("Error recording audio");
        recordButton.disabled = false;
        stopButton.disabled = true;
    });
}

function stopRecording() {
    console.log("stop button clicked");
    recording.hidden = true;
    stopButton.disabled = true;
    recordButton.disabled = false;
    rec.stop();
    gumStream.getAudioTracks()[0].stop();
    rec.exportWAV(registerVoice);
}

function submit() {
    let firstName = $("#first_name").val();
    let lastName = $("#last_name").val();
    let email = $("#email").val();

    $.ajax({
        type:"POST",
        url: SERVER_ADDRESS + '/submit',
        data:{
            "firstName": firstName,
            "lastName": lastName,
            "email" : email
        },
        success: function(){
            console.log("successfully update database");
            recordButton.disabled = true;
            stopButton.disabled = true;
            submitButton.disabled = true;
        },
        error: function(err){
            console.log("Failed to submit voice registration with error: " + err);
        }
    });
}

function createProfile() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", SERVER_ADDRESS+"/create");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();

    xhr.onload = function(e) {
        try {
            if (xhr.status === 200){
                console.log("Server returned: ", e.target.statusText);
                recordButton.disabled = false;
                createButton.disabled = true;
            } else {
                alert ("Failed to create profile, please refresh and try again!");
            }
        } catch(err) {
            console.log("Failed to create profile with error: " + err);
        }
    };
}

function registerVoice(blob) {
    moreAudio.hidden = true;
    enrollSuccess.hidden = true;

    let fd = new FormData();
    fd.append("voice_sample", blob, "voiceSample");
    let xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
        try {
            if (xhr.status === 200) {
                let responseText = JSON.parse(xhr.responseText);
                if(responseText.processingResult.remainingEnrollmentSpeechTime > 0){
                    moreAudio.hidden = false;
                    enrollSuccess.hidden = true;
                } else if (responseText.processingResult.enrollmentStatus === "Enrolled"){
                    moreAudio.hidden = true;
                    enrollSuccess.hidden = false;
                    submitButton.disabled = false;
                }
                recordButton.disabled = false;
            } else {
                moreAudio.hidden = false;
            }
        } catch(err) {
            console.log("Failed to create enrollment with error: " + err);
        }
    };
    xhr.open("POST", SERVER_ADDRESS + '/register');
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");
    // xhr.setRequestHeader("Content-Type", "applicaton/json");
    xhr.send(fd);
}