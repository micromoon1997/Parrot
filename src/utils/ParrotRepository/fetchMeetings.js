import axios from 'axios';

export const fetchMeetings = async () => {
    const instance = axios.create({
        baseURL: 'http://localhost:3000'
      });

    const meetings = await instance.get('/render/meetings');
    return meetings.data;
};