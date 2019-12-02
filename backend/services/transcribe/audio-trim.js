const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath("C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe");
// ffmpeg.setFfprobePath("C:\\ProgramData\\chocolatey\\bin\\ffprobe.exe");

const minLength = 10;
const wordsPause = 0.4;

//this function checks a participant 's audio length is long enough,
//eg. [[startTime1, endTime1], [startTime2, endTime2]]
function checkAudioLength(timeDurationArr) {
    let sum = 0;
    timeDurationArr.forEach((duration) => {
        sum += duration[1] - duration[0];
    });

    return (sum >= minLength);
}

// function to merge two time duration if they r continue
function mergeDuration(value) {
    for (let i = 0; i < value.length - 1; i++) {
        if (value[i][1] === value[i + 1][0] || (value[i][1] < value[i + 1][0] && value[i][1] > value[i + 1][0] - wordsPause)) {
            value[i][1] = value[i + 1][1];
            value.splice(i + 1, 1);
            i--;
        }
    }
}

function splitAudioFileBySpeakers(value, key, path) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < value.length; i++) {
            //console.log(value[i][0]);
            ffmpeg(path)
                .setStartTime(value[i][0])
                .setDuration(value[i][1] - value[i][0])
                .on('error', function (err) {
                    console.log('An error occurred: ' + err.message);
                    reject();
                })
                .on('end', resolve)
                .save(`${__appRoot}/tmp/${key}${i}.wav`);
        }
    });
}

function mergeAudioFilesOfSameSpeaker(value, key) {
    return new Promise((resolve, reject) => {
        let speakerAudio = ffmpeg();
        for (let i = 0; i < value.length; i++) {
            speakerAudio
                .input(`${__appRoot}/tmp/${key}${i}.wav`);
        }

        speakerAudio.mergeToFile(`${__appRoot}/tmp/speaker${key}.wav`)
            .audioFrequency(16000)
            .on('error', function (err) {
                console.log('An error occurred: ' + err.message);
                reject();
            })
            .on('end', function () {
                resolve();
            });
    });
}

module.exports = {
    checkAudioLength: checkAudioLength,
    mergeDuration: mergeDuration,
    splitAudioFileBySpeakers: splitAudioFileBySpeakers,
    mergeAudioFilesOfSameSpeaker: mergeAudioFilesOfSameSpeaker
};