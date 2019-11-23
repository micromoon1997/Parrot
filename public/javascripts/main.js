window.navigator = window.navigator || {};
let audioContext = window.AudioContext || window.webkitAudioContext;
let gumStream;
let rec;

// everyone should set this to their own ngrok address
const SERVER_ADDRESS = "http://localhost:3000";

let recordButton = document.getElementById("record");
recordButton.addEventListener("click", startRecording);
let stopButton = document.getElementById("stop");
stopButton.addEventListener("click", stopRecording);

let recording = document.getElementById("recording");

let moreAudio = document.getElementById("more_audio");
let enrollSuccess = document.getElementById("success");

function startRecording() {
    console.log("record button clicked");
    let options = { audio: true };
    recordButton.disabled = true;
    stopButton.disabled = false;
    navigator.mediaDevices.getUserMedia(options).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
        let ac = new audioContext();
        gumStream = stream;
        let input = ac.createMediaStreamSource(stream);
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

function registerVoice(blob) {
    let firstName = document.getElementById("first_name").value;
    let lastName = document.getElementById("last_name").value;
    let email = document.getElementById("email").value;

    moreAudio.hidden = true;
    enrollSuccess.hidden = true;

    let fd = new FormData();
    fd.append("first_name", firstName);
    fd.append('last_name', lastName);
    fd.append('email', email);
    fd.append("voice_sample", blob, "voiceSample");
    let xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let responseText = JSON.parse(xhr.responseText);
            if(responseText.processingResult.remainingEnrollmentSpeechTime > 0){
                moreAudio.hidden = false;
                enrollSuccess.hidden = true;
            } else if (responseText.processingResult.enrollmentStatus === "Enrolled"){
                moreAudio.hidden = true;
                enrollSuccess.hidden = false;
            }
            recordButton.disabled = false;
        } else if( xhr.readyState === 4 ) {
            console.log(xhr.responseText);
            let responseText = JSON.parse(xhr.responseText);
            moreAudio.hidden = false;
            if(responseText.status && responseText.status === 'failed') {
                alert('Wrong audio format');
            } else {
                alert(responseText.error.message);
            }
        }
    };
    xhr.open("POST", SERVER_ADDRESS + '/register');
    xhr.send(fd);
}