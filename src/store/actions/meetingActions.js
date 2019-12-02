import {getTranscription} from '../../utils/ParrotRepository';

export const WILL_FETCH_MEETINGS = 'WILL_FETCH_MEETINGS';
export const DID_FETCH_MEETINGS = 'DID_FETCH_MEETINGS';

export const WILL_FETCH_TRANSCRIPTION = 'WILL_FETCH_TRANSCRIPTION';
export const DID_FETCH_TRANSCRIPTION = 'DID_FETCH_TRANASCRIPTION';

export const willFetchMeetings = () => ({
    type: WILL_FETCH_MEETINGS
})

export const didFetchMeetings = meetings => ({
    type: DID_FETCH_MEETINGS,
    meetings
})

export const willFetchTranscription = () => ({
    type: WILL_FETCH_TRANSCRIPTION
})

export const didFetchTranscription = transcription => ({
    type: DID_FETCH_TRANSCRIPTION,
    transcription
})

export const fetchTranscription = transcriptionId => {
    return async dispatch => {
        dispatch(willFetchTranscription());
        const transcription = await getTranscription(transcriptionId);
        dispatch(didFetchTranscription(transcription));
    };
};