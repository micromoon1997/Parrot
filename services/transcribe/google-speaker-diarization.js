process.env['GOOGLE_APPLICATION_CREDENTIALS'] = `${__dirname}/../../private-key.json`;

const audioTrim = require('./audio-trim');
const bucketName = 'untranscribed';

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech').v1p1beta1;
const {Storage} = require('@google-cloud/storage');

// Creates a client
const client = new speech.SpeechClient();
const storage = new Storage();

function createGoogleCloudWriteStream(fileName) {
    return storage.bucket(bucketName).file(fileName).createWriteStream({
        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000'
        }
    });
}

function createGoogleCloudReadStream(fileName) {
    return storage.bucket(bucketName).file(fileName).createReadStream();
}

async function getUntaggedTranscription(meetingId, speakerCount) {
    const audio = {
        uri: `gs://${bucketName}/${meetingId}`
        //content: fs.readFileSync(recordingFileUrl).toString('base64')
    };
    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 8000,
        languageCode: `en-US`,
        enableSpeakerDiarization: true,
        diarizationSpeakerCount: speakerCount,
        model: 'phone_call',
        enableAutomaticPunctuation: true,
    };

    const request = {
        config: config,
        audio: audio,
    };

    const [operation] = await client.longRunningRecognize(request);
    const [response] = await operation.promise();

    // const transcription = response.results
    //     .map(result => result.alternatives[0].transcript)
    //     .join('\n');
    // console.log(`Transcription: ${transcription}`);

    const result = response.results[response.results.length - 1];
    const wordsInfo = result.alternatives[0].words;
    // Note: The transcript within each result is separate and sequential per result.
    // However, the words list within an alternative includes all the words
    // from all the results thus far. Thus, to get all the words with speaker
    // tags, you only have to take the words list from the last result:
    let prevTag = 0;
    let sentence = 'Meeting Minutes\n';
    const speakersAudio = new Map();
    wordsInfo.forEach((a) => {
        let timeDuration = [parseInt(a.startTime.seconds) + (a.startTime.nanos) / 1000000000, parseInt(a.endTime.seconds) + (a.endTime.nanos) / 1000000000];
        if (a.speakerTag !== prevTag) {
            sentence += `\nspeaker${a.speakerTag}: ${a.word}`;
        } else {
            sentence += ` ${a.word}`;
        }
        prevTag = a.speakerTag;

        if (speakersAudio.length !== speakerCount || !speakersAudio.get(a.speakerTag)
            || !audioTrim.checkAudioLength(speakersAudio.get(a.speakerTag))) {
            if (!speakersAudio.get(a.speakerTag)) {
                speakersAudio.set(a.speakerTag, [timeDuration]);
            } else {
                const currArrDuration = speakersAudio.get(a.speakerTag);
                currArrDuration.push(timeDuration);
                speakersAudio.set(a.speakerTag, currArrDuration);
            }
        }

    });
    speakersAudio.forEach(audioTrim.mergeDuration);
    console.log(speakersAudio);
    for (let [key, value] of speakersAudio) {
        await audioTrim.splitAudioFileBySpeakers(value, key, createGoogleCloudReadStream(meetingId));
    }

    for (let [key, value] of speakersAudio) {
        await audioTrim.mergeAudioFilesOfSameSpeaker(value, key);
    }

    console.log(sentence);
    return sentence;
}

module.exports = {
    getUntaggedTranscription: getUntaggedTranscription,
    createGoogleCloudWriteStream: createGoogleCloudWriteStream
};

