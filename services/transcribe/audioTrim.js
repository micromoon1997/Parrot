const ffmpeg = require('fluent-ffmpeg');


const fileName = '../../test2.wav';
const minLength = 10;

//this function checks a partipant 's audio length is long enough,
//eg. [[startTime1, endTime1], [startTime2, endTime2]]
const checkAudioLength = function (timeDurationArr){
    let sum = 0;
    timeDurationArr.forEach((duration)=>{
        sum += duration[1]-duration[0];
    });

    return (sum>=minLength);
};

// function to merge two time duation if they r continue
const mergeDuration = function(value){
    for (let i = 0; i<value.length-1; i++){
        if (value[i][1] === value[i+1][0]){
            value[i][1] = value[i+1][1];
            value.splice(i+1,1);
            i--;
        }
    }

};

const getSpeakersSample = function (value, key, map){
    let speakAudio = ffmpeg(fileName);
    for (let i = 0; i<value.length; i++) {
        console.log(value[i][1] - value[i][0]);
        speakAudio
        .setStartTime(value[i][0])
        .setDuration(value[i][1] - value[i][0])
        .on('error', function (err) {
                console.log('An error occurred: ' + err.message);
            })
    }

    speakAudio.mergeToFile('./output/speaker' + key + '.wav')
        .on('error', function (err) {
            console.log('An error occurred: ' + err.message);
        })
        .on('end', function () {
            console.log('Processing finished !');
        })
};

module.exports ={
    checkAudioLength:checkAudioLength,
    mergeDuration:mergeDuration,
    getSpeakersSample:getSpeakersSample
};