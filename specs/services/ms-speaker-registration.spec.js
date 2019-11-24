const azureClient = require('../../services/ms-speaker-registration');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../../app');
const nock = require('nock');

chai.use(chaiHttp);

// describe('hook', function(){
//     before(function() {
//         app.listen(3002);
//     });
    
//     after(function() {
//         app.close();
//     }); 
// });

describe("Azure cognitive service client", function () {
    it('should tag transcription', async function () {
        const meetingId = 'test2';
        // Vincent, Yan and Desta respectively
        const profileIds = ['4d83796d-bcce-4664-b336-7b80a25f11b6', 'b84adae5-881b-4dc4-b2ae-4c18b35839f7', 'b84adae5-881b-4dc4-b2ae-4c18b35839f7'];
        const untaggedTranscription = 'Meeting Minutes\n' +
            '\n' +
            'speaker3: Good morning Professor Austin early\n' +
            'speaker2: morning James. I\'m doing well, and you I\'m great.\n' +
            'speaker3: Thank you. This is my friend Emma. She\'s thinking about applying to this college. She has a few questions. Would you mind solely us about this process, please?\n' +
            'speaker2: Hello Emma. It\'s presently 2. I\'m more than happy to we speak with you. Please stop by my office next week\n' +
            'speaker1: and Sophia to meet you faster. Thank you so much for helping\n' +
            'speaker2: the message. Hopefully I will be able to answer over your question.\n';
        // await azureClient.tagTranscription(meetingId, profileIds, untaggedTranscription);
    })
});

describe("createProfile", () => {
    it("It should call the createProfile function with status code 200", () => {
        console.log("NODE_ENV");
        console.log(process.env.NODE_ENV);
        const scope = nock(/127/)
            .post('/create')
            .reply(200, {identificationProfileId: '49a36324-fc4b-4387-aa06-090cfbf0064f'});

        chai.request(app)
            .post('/create')
            .end((err,res) => {
                console.log(res);
                expect(res.statusCode).to.equal(200);
                const body = { identificationProfileId: '49a36324-fc4b-4387-aa06-090cfbf0064f' };
                expect(res.body).to.be.eql(body);
            });
    });
    it("It should call the createProfile function with status code 500", () => {
        const scope = nock(/127/)
            .post('/create')
            .reply(500, {
                "error":{
                  "code" : "InternalServerError",
                  "message" : "SpeakerInvalid", 
                }
              });

        chai.request(app)
            .post('/create')
            .end((err,res) => {
                console.log(res);
                expect(res.statusCode).to.equal(500);
                const body = {
                    "error":{
                      "code" : "InternalServerError",
                      "message" : "SpeakerInvalid", 
                    }
                  };
                expect(res.body).to.be.eql(body);
            });
    })
});