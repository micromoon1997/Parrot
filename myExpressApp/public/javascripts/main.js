window.navigator = window.navigator || {};

var audioContext = window.AudioContext || window.webkitAudioContext;
var gumStream;
var rec;
var input;
var key = "b1df4f201b78443fb7cd7e6345226f26";

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
    recordButton.disabled = true
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
    submitButton.disabled = false;
}

function submit() {
    recordButton.disabled = true;
    stopButton.disabled = true;
    submitButton.disabled = true;
    rec.exportWAV(registerVoice);
}

function registerVoice(blob) {
    var fd = new FormData();
    $.ajax({
        // Create voice profile
        url: "https://cs319speechrecog.cognitiveservices.azure.com/spid/v1.0/identificationProfiles",
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", key);
        },
        type: "POST",
        data: '{"locale":"en-us"}'
    }).done(function (response) {
        console.log("Successfully created voice profile");
        guid = response.identificationProfileId;
        fd.append("voice_sample", blob, "voiceSample");
        // Create voice enrollment
        var xhr = new XMLHttpRequest();
        xhr.onload = function(e) {
            if (this.readyState == 4){
                console.log("Server returned: ", e.target.statusText);
                recordButton.disabled = false;
            }
        };
        xhr.open("POST", "https://cs319speechrecog.cognitiveservices.azure.com/spid/v1.0/identificationProfiles/"+guid+"/enroll", true);
        // xhr.setRequestHeader("Content-Type", "multipart/form");
        xhr.setRequestHeader("Ocp-Apim-Subscription-Key", key);
        xhr.send(fd);
        console.log("Successfully enrolled voice profile");
        // Get operation status 
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && xhr.status == 202)
            {
                console.log(xhr.responseText); // Another callback here
                var xhr1 = new XMLHttpRequest();
                url = xhr.getResponseHeader("Operation-Location");
                xhr1.open("GET", url);
                xhr1.setRequestHeader("Ocp-Apim-Subscription-Key", key);
                xhr1.send()
                xhr1.onerror = function(){
                    alert("Get operation status error");
                }
            }
        };
        xhr.onerror = function(){
            alert("Error occured while enrolling");
        }
    }).fail(function (err) {
        alert("Create profile error");
    });
}