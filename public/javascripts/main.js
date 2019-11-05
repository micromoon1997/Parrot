window.navigator = window.navigator || {};

let audioContext = window.AudioContext || window.webkitAudioContext;
let gumStream;
let rec;
let input;

// everyone should set this to their own ngrok address
const SERVER_ADDRESS = "https://fd50538f.ngrok.io";

let createButton = document.getElementById("create_profile");
createButton.addEventListener("click", createProfile);
let recordButton = document.getElementById("record");
recordButton.addEventListener("click", startRecording);
let stopButton = document.getElementById("stop");
stopButton.addEventListener("click", stopRecording);

let more_audio = document.getElementById("more_audio");
let enroll_success = document.getElementById("success");

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
    recordButton.disabled = true;
    stopButton.disabled = true;
    submitButton.disabled = true;
}

function createProfile() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", SERVER_ADDRESS+"/create");
    xhr.setRequestHeader("Content-Type", "applicaton/json");
    xhr.send();

    xhr.onload = function(e) {
        if (xhr.status === 200){
            console.log("Server returned: ", e.target.statusText);
            recordButton.disabled = false;
            createButton.disabled = true;
        }else {
            aler ("Failed to create profile, please refresh and try again!");
        }
    };
}

function registerVoice(blob) {
    more_audio.hidden = true;
    enroll_success.hidden = true;

    let fd = new FormData();
    fd.append("voice_sample", blob, "voiceSample");
    let xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
        if (xhr.status === 200) {
            let responseText = JSON.parse(xhr.responseText);
            if(responseText.processingResult.remainingEnrollmentSpeechTime > 0){
                more_audio.hidden = false;
                enroll_success.hidden = true;
            } else if (responseText.processingResult.enrollmentStatus === "Enrolled"){
                more_audio.hidden = true;
                enroll_success.hidden = false;
            }
            recordButton.disabled = false;
        } else {
            more_audio.hidden = false;
        }
    };
    xhr.open("POST", SERVER_ADDRESS + '/register');
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");
    // xhr.setRequestHeader("Content-Type", "applicaton/json");
    xhr.send(fd);
}