import {
    WILL_FETCH_MEETINGS,
    DID_FETCH_MEETINGS,
    WILL_FETCH_TRANSCRIPTION,
    DID_FETCH_TRANSCRIPTION
} from '../actions/meetingActions';

const meetingReducer = (state = null, action) => {
    switch (action.type) {
        case WILL_FETCH_MEETINGS:
            return {
                meetings: null
            };
        case DID_FETCH_MEETINGS:
            return {
                ...state,
                meetings: action.meetings
            };
        case WILL_FETCH_TRANSCRIPTION:
            return {
                ...state,
                transcription: null
            };
        case DID_FETCH_TRANSCRIPTION:
            return {
                ...state,
                transcription: action.transcription
            };
        default:
            return state;
    }
}

export default meetingReducer;