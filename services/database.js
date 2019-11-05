const MongoClient = require('mongodb').MongoClient;
let db;

async function connectDatabase() {
  const dbHost = process.env.MONGODB_HOST;
  const dbPort = process.env.MONGODB_PORT;
  const dbName = process.env.MONGODB_NAME;
  const dbUserName = process.env.MONGODB_USERNAME;
  const dbPassword = process.env.MONGODB_PASSWORD;
  const dbOptions = process.env.MONGODB_OPTIONS;
  const dbUrl = `mongodb+srv://${dbUserName}${dbPassword ? ':' + dbPassword : ''}@${dbHost}:${dbPort}/${dbName}${dbOptions ? '?' + dbOptions : ''}`;
  const client = new MongoClient(dbUrl, { useNewUrlParser: true , useUnifiedTopology: true });
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Database successfully connected.');
  } catch (e) {
    console.error('Fail to initialize database:' + e);
  }
}

function getDatabase() {
  if (db) {
    return db;
  } else {
    console.warn('Requesting database instance when it has not been initialized.');
  }
}

module.exports = {
  connectDatabase: connectDatabase,
  getDatabase: getDatabase
};