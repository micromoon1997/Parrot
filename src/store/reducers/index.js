import {combineReducers} from 'redux';
import meeting from './meetingReducers';
import meetingPage from './meetingPageReducers';

export default combineReducers({
    meeting,
    meetingPage
});