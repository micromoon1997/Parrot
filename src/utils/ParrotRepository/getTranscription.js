import axios from 'axios';

export const getTranscription = async transcriptionId => {
    const instance = axios.create({
        baseURL: 'http://localhost:3000'
      });

    const transcription = await instance.get(`/render/transcription/${transcriptionId}`);
    console.log(transcription);
    return transcription;
};