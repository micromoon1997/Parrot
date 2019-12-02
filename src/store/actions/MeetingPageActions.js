import {
    willFetchMeetings,
    didFetchMeetings
} from './meetingActions';
import {fetchMeetings} from '../../utils/ParrotRepository';

export const WILL_INITIALIZE_PAGE = 'WILL_INITIALIZE_PAGE';
export const DID_INITIALIZE_PAGE = 'DID_INITIALIZE_PAGE';

export const willInitializePage = () => ({
    type: WILL_INITIALIZE_PAGE
})

export const didInitializePage = () => ({
    type: DID_INITIALIZE_PAGE
})

export const initializePage = () => async (dispatch) => {
    dispatch(willInitializePage());

    try {
        dispatch(willFetchMeetings());
        const meetings = await fetchMeetings();
        dispatch(didFetchMeetings(meetings));

        dispatch(didInitializePage());
    } catch(e) {
        console.log(e);
    }
}