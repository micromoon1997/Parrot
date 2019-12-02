const MongoClient = require('mongodb').MongoClient;
const dbPort = 27017;
const dbHost = 'localhost';
const dbUrl = `mongodb://${dbHost}:${dbPort}/test`;
const client = new MongoClient(dbUrl, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect()
  .then(async () => {
    try {
      const db = client.db('test');
      await db.dropDatabase();
      const people = [
        { email: 'yhy1009511320@gmail.com', firstName: 'Adam', lastName: 'Yang', voiceSampleUrl: 'localhost', phoneNumber: '7788888888', ASRGuid: null },
        { email: 'breannehuang98@gmail.com', firstName: 'Breanne', lastName: 'Huang', voiceSampleUrl: 'localhost', phoneNumber: '7788888888', ASRGuid: null },
        { email: 'destachi96@outlook.com', firstName: 'Desta', lastName: 'Chi', voiceSampleUrl: 'localhost', phoneNumber: '7788888888', ASRGuid: null },
        { email: 'kwan.lam@alumni.ubc.ca', firstName: 'Kwan', lastName: 'Lam', voiceSampleUrl: 'localhost', phoneNumber: '7788888888', ASRGuid: null },
        { email: 'wangyan951027@163.com', firstName: 'Yan', lastName: 'Wang', voiceSampleUrl: 'localhost', phoneNumber: '7788888888', ASRGuid: null },
        { email: 'ychenvin@gmail.com', firstName: 'Vincent', lastName: 'Lin', voiceSampleUrl: 'localhost', phoneNumber: '7788888888', ASRGuid: null }
      ];
      await db.collection('people').createIndex( { email: 1 }, { unique: true });
      await db.collection('people').insertMany(people);
      console.log('Mock data added to database.');
      process.exit(0);
    } catch (e) {
      console.log(e);
    }
  });