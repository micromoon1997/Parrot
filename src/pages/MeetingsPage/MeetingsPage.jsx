import React, {useEffect} from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {Table, TableHead, TableRow, TableCell, TableBody, Button, Paper} from '@material-ui/core';
import {selectMeetings} from '../../store/selectors/meetingSelectors';
import {selectIsInitialized} from '../../store/selectors/meetingPageSelectors';
import {initializePage} from '../../store/actions/MeetingPageActions';

const buildMeetingsTable = meetings => {
    return (meetings || []).map(meeting => {
        const {
            meetingId,
            end: {
                dateTime: endDateTime
            },
            isCancelled,
            meetingManager: {
                emailAddress : {
                    name,
                    address
                }
            },
            participants,
            phoneNumber,
            start: {
                dateTime: startDateTime
            }
        } = meeting;

        return {
            organizerName: name,
            organizerEmail: address,
            participants,
            phoneNumber,
            isCancelled,
            startTime: moment(moment.utc(startDateTime).toDate()).local().format('LLL'),
            endTime: moment(moment.utc(endDateTime).toDate()).local().format('LLL'),
            transcription: meetingId
        };
    })
};

const useComponentWillMount = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializePage());
    }, [dispatch]);
};

const MeetingsPage = () => {
    useComponentWillMount();
    const isInitialized = useSelector(selectIsInitialized);
    const meetings = useSelector(selectMeetings);

    if (!isInitialized) {
        return null;
    }

    const meetingItems = buildMeetingsTable(meetings);

    return (
        <Paper>
            <h1>
                Meetings
            </h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Organizer Name</TableCell>
                        <TableCell>Organizer Email</TableCell>
                        <TableCell>Participants</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Cancelled</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>End Time</TableCell>
                        <TableCell>Transcription</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {meetingItems
                        ? meetingItems.map((meetingItem, index) => {
                            const {
                                organizerName,
                                organizerEmail,
                                participants,
                                phoneNumber,
                                isCancelled,
                                startTime,
                                endTime,
                                transcription
                            } = meetingItem;

                            return (
                                <TableRow key={index}>
                                    <TableCell>{organizerName}</TableCell>
                                    <TableCell>{organizerEmail}</TableCell>
                                    <TableCell>{participants ? participants.length : '-'}</TableCell>
                                    <TableCell>{phoneNumber}</TableCell>
                                    <TableCell>{typeof isCancelled === 'boolean' ? isCancelled.toString() : '-'}</TableCell>
                                    <TableCell>{startTime}</TableCell>
                                    <TableCell>{endTime}</TableCell>
                                    <TableCell>
                                        <Button
                                            color='secondary'
                                            onClick={
                                                () => axios({
                                                    url: `http://localhost:3000/render/transcription/${transcription}`,
                                                    method: 'GET',
                                                    responseType: 'blob',
                                                }).then((response) => {
                                                    console.log(response);
                                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    link.setAttribute('download', 'transcription.txt');
                                                    document.body.appendChild(link);
                                                    link.click();
                                                })
                                            }
                                        >
                                        Click to download
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                        : null}
                </TableBody>
            </Table>
        </Paper>
    )
};

export default MeetingsPage;