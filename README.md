# Parrot
> a meeting transcription service

## Installation
```shell script
npm install
```
And use [this link](https://drive.google.com/drive/folders/1aE_LjLUkRsbb2ywcFtjPlKd4GyBHGaBB?usp=sharing) to get the `.env` and `private-key.json` files.
Put these files under the root directory of the app.

You also need install [FFmpeg](https://www.ffmpeg.org/) on your machine to be able to run the transcription.
1. For MacOS user, it is recommended to use ```brew install ffmpeg```.
2. For Windows user, once download and installation are finished, make sure to declare the installation path in the ```services/transcribe/audioTrim.js```. The following code are recommended: 
```
ffmpeg.setFfmpegPath("[Your installation path]\\ffmpeg.exe");
ffmpeg.setFfprobePath("[Your installation path]\\ffprobe.exe");
```


## Start Server
```shell script
npm start
```

## Test Procedure
1. Start Server
2. Open `localhost:3000/enroll` in your browser. Follow the instructions on the page.
3. Use your email to send a meeting invitation to `wavesbot319@outlook.com`, include your phone number in the email
body using this format:
`[Meeting phone number: {YOUR PHONE NUMBER HERE}]`
4. There should be a phone call to your phone at the time you specified in the meeting invitation.
5. Hand up the phone. A transcription file should be generate in `./transcriptions`  shortly.