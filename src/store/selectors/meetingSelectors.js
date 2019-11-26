import {createSelector} from 'reselect';
import {selectMeeting} from './rootSelectors';

export const selectMeetings = createSelector(selectMeeting, meeting => meeting && meeting.meetings);
export const selectTranscription = createSelector(selectMeeting, meeting => meeting && meeting.transcription);