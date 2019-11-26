const fs = require('fs').promises;
const resolve = require('path').resolve;

const getTranscription = async transcriptionId => {
    // const path = resolve(`transcriptions/${transcriptionId}.txt`);
    const path = resolve(`transcriptions/test.txt`);
    const transcription = await fs.readFile(path, 'utf8');

    return transcription;
};

module.exports = {
    getTranscription
}