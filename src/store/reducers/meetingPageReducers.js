import {
    WILL_INITIALIZE_PAGE,
    DID_INITIALIZE_PAGE
} from '../actions/MeetingPageActions';

const meetingPageReducer = (state = null, action) => {
    switch (action.type) {
        case WILL_INITIALIZE_PAGE:
            return {
                isInitialized: false
            };
        case DID_INITIALIZE_PAGE:
            return {
                isInitialized: true
            };
        default:
            return state;
    }
}

export default meetingPageReducer;