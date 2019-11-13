# docker-parrot
> a meeting transcription service

## Installation
1. Install docker and set the enviornment to Linux.
2. 
```
docker pull ychenvin/docker-parrot
```

## Run the image
1. start the server:
```
docker run -d -p 8888:3000 mtsapp
```

2. view the real-time command line logs of the container: 
``` 
docker ps
```
&& ```
docker logs -f ${the running container id}
```

## Test
1. Go to [localhost:8888/enroll](localhost:8888/enroll) and follow the instructions to enroll your email address and your voice sample.
2. Use the pre-registered email address to send a meeting invitation to [wavesbot319@outlook.com](); make sure the email body contains ``` [meeting phone number: 7778889999]```*.
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

* for now, the phone number can only be Vincent's phone number, because twillio trial account only allows one phone number.

## Conclusion
This is the integrated product of the meeting transcibe services. All the components are deployed in the docker image. 