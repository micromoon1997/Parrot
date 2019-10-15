process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './private-key.json';

const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech').v1p1beta1;

// Creates a client
const client = new speech.SpeechClient();

//const fileName = 'OSR_us_000_0010_8k.wav';
//const fileName = 'testthreeppl.wav';
const fileName = 'test2.wav';
const speakerCount = 3;
const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 8000,
    languageCode: `en-US`,
    enableSpeakerDiarization: true,
    diarizationSpeakerCount: speakerCount,
    model: 'phone_call',
    enableAutomaticPunctuation: true,
};
//const uri = 'file://C:/Users/MSI/OneDrive/UBC/CPSC_319/sandbox/google-speaker-diarization//conversation.wav';
const audio = {
    //uri: uri,
    content: fs.readFileSync(fileName).toString('base64'),
};
const request = {
    config: config,
    audio: audio,
};

const getResponse = async () => {
    // const [operation] = await client.longRunningRecognize(request);
    // const [response] = await operation.promise();

    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: ${transcription}`);
    const result = response.results[response.results.length - 1];
    const wordsInfo = result.alternatives[0].words;
// Note: The transcript within each result is separate and sequential per result.
// However, the words list within an alternative includes all the words
// from all the results thus far. Thus, to get all the words with speaker
// tags, you only have to take the words list from the last result:
    let prevTag = 0;
    let sentence = "Meeting Minutes\n";
    wordsInfo.forEach((a) => {
            if (a.speakerTag !== prevTag) {
                sentence += `\nSpeaker ${a.speakerTag}: ${a.word}`;
            } else {
                sentence += ` ${a.word}`;
            }
            prevTag = a.speakerTag;
        }
    );
    return sentence;
};
getResponse()
    .then((sentence) => {
        fs.writeFile('MeetingMinutes.txt', sentence, 'utf8', (err) => {
            if (err) throw err;
        });
    })
    .catch((err) => {
        console.log(err);
    });

