const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../../app');
const nock = require('nock');
const fs = require('fs');

const AZURE_KEY = process.env["AZURE_COGNITIVE_KEY"];
const AZURE_ENDPOINT = process.env["AZURE_COGNITIVE_ENDPOINT"];

chai.use(chaiHttp);

describe("createProfile", () => {
    it("It should create profile", () => {
        nock(AZURE_ENDPOINT, {
            reqheaders: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': AZURE_KEY
            }
        })
        .post('/identificationProfiles',{ locale: 'en-us' })
        .reply(200, {identificationProfileId: '49a36324-fc4b-4387-aa06-090cfbf0064f'});

        chai.request(app)
            .post('/create')
            .end((err,res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.text).to.be.equal('49a36324-fc4b-4387-aa06-090cfbf0064f');
            });
    });

    it("It should call the createProfile function with status code 500", () => {
        nock(AZURE_ENDPOINT,{
            reqheaders: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': AZURE_KEY
            }})
        .post('/identificationProfiles',{ locale: 'en-us' })
        .reply(500, {
            "error":{
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid", 
            }
        });

        chai.request(app)
            .post('/create')
            .end((err,res) => {
                expect(res.statusCode).to.equal(500);
            });
    });
});