window.navigator = window.navigator || {};

var audioContext = window.AudioContext || window.webkitAudioContext;
var gumStream;
var rec;
var input;
const SERVER_ADDRESS = "https://7b355025.ngrok.io";

let createButton = document.getElementById("create_profile");
createButton.addEventListener("click", createProfile);

var recordButton = document.getElementById("record");
recordButton.addEventListener("click", startRecording);
var stopButton = document.getElementById("stop");
stopButton.addEventListener("click", stopRecording);


var submitButton = document.getElementById('submit');
submitButton.addEventListener("click", submit);
var recording = document.getElementById("recording");
var guid;

function startRecording() {
    console.log("record button clicked");
    var options = { audio: true };
    recordButton.disabled = true;
    stopButton.disabled = false;
    navigator.mediaDevices.getUserMedia(options).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
        var ac = new audioContext({sampleRate:16000});
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
        if (this.readyState === 4 && xhr.status === 200){
            console.log("Server returned: ", e.target.statusText);
            recordButton.disabled = false;
            createButton.disabled = true;
        }
    };
}

function registerVoice(blob) {
    let fd = new FormData();
    fd.append("voice_sample", blob, "voiceSample");
    let xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
        if (this.readyState === 4 && xhr.status === 200){
            console.log("Server returned: ", xhr.responseText);
            recordButton.disabled = false;
        }
    };
    xhr.open("POST", SERVER_ADDRESS + '/register');
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");
    // xhr.setRequestHeader("Content-Type", "applicaton/json");
    xhr.send(fd);
    // console.log("Successfully enrolled voice profile");
        // Get operation status 
        // xhr.onreadystatechange = function(){
        //     if (xhr.readyState == 4 && xhr.status == 202)
        //     {
        //         console.log(xhr.responseText); // Another callback here
        //         var xhr1 = new XMLHttpRequest();
        //         url = xhr.getResponseHeader("Operation-Location");
        //         xhr1.open("GET", url);
        //         xhr1.setRequestHeader("Ocp-Apim-Subscription-Key", key);
        //         xhr1.send();
        //         xhr1.onerror = function(){
        //             alert("Get operation status error");
        //         }
        //     }
        // };
        // xhr.onerror = function(){
        //     alert("Error occured while enrolling");
        // }
    // }).fail(function (err) {
    //     alert("Create profile error");
    // });
}