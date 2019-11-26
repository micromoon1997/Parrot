import {createSelector} from 'reselect';
import {selectMeetingPage} from './rootSelectors';

export const selectIsInitialized = createSelector(selectMeetingPage, meetingPage => meetingPage && meetingPage.isInitialized);