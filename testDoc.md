# docker-parrot
> a meeting transcription service

## Installation
1. Install docker and set the enviornment to Linux.
2. Pull the latest docker images, which now is 2.2
```
docker pull ychenvin/mtsparrot:{the latest tag}
```

## Run the image
1. start the server:
```
docker run -d -p 8888:3000 ychenvin/mtsparrot:{the latest tag}
```

2. view the real-time command line logs of the container:
```
docker ps
```
&
```
docker logs -f ${the running container id}
```

By this point, the console should look like below:
```
Microsoft Graph API Subscription created. Id: a984513f-05a3-42ad-a0a4-b21721913145
Current subscriptions:
[
  {
    "id": "a984513f-05a3-42ad-a0a4-b21721913145",
    "resource": "me/events",
    "applicationId": "220cf0fd-9bf3-47fb-b86d-7976d3ffafd4",
    "changeType": "created,updated",
    "clientState": null,
    "notificationUrl": "https://sharp-jellyfish-8.localtunnel.me/email",
    "expirationDateTime": "2019-11-19T05:53:46.303Z",
    "creatorId": "00037FFE262C380D"
  }
]
Database updated.
Server started. Listening on port: 3000
```

## Test
1. Go to [localhost:8888/enroll](localhost:8888/enroll) and follow the instructions to enroll your email address and your voice sample.
2. Use the pre-registered email address to send a meeting invitation to [wavesbot319@outlook.com](); make sure the email body contains ``` [meeting phone number: {Your phone number}]```*.
3. Upon this point, the logs in the terminal should have some POST request which indicates meeting created/updated/deleted.
4. If the phone number in the email body is matched with the twillio phone number, you should expect a call when it is the meeting time.
5. Once finished the phone call, MTS will start its transcription and recognize the speakers.

Sample output in the terminal:

```
Database updated.
POST /email 202 1853.062 ms - 8
Calling to meeting:AQMkADAwATM3ZmYAZS0yNjJjLTM4MGQtMDACLTAwCgBGAAAD8qzntYMa0UmNcvdfBhUq0gcADCxh1Fj7O0a5Tk9J4AgFYAAAAgENAAAADCxh1Fj7O0a5Tk9J4AgFYAAAABW6qIMAAAA=
Map { 1 => [ [ 0, 7.1 ], [ 8.5, 12.6 ] ] }
Processing finished !
6e414b2e-372c-41f2-9077-2e68b3d074ab
https://cs319speechrecog.cognitiveservices.azure.com/spid/v1.0/operations/d1f76ebb-8e53-4e43-b9d0-18f2cd16df37
```

Sample output files in the /services/transcibe/output

```
{meetingID}.txt
speaker1.wav
speaker2.wav
```


## Conclusion
This is the integrated product of the meeting transcibe services. All the components are deployed in the docker image.
