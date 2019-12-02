const fs = require('fs').promises;
const resolve = require('path').resolve;

const getTranscription = async transcriptionId => {
    const path = resolve(`${__appRoot}/transcriptions/${transcriptionId}.txt`);
    // const path = resolve(`transcriptions/test.txt`);
    return await fs.readFile(path, 'utf8');
};

module.exports = {
    getTranscription
};