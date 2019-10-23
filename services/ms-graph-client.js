require("isomorphic-fetch");
const graph = require('@microsoft/microsoft-graph-client');
const authHelper = require('./auth');

let client;

function initClient() {
  const accessToken = authHelper.getAccessToken();
  return graph.Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
}

function getClient() {
  if (!client) {
    client = initClient();
  }
  return client;
}

module.exports = getClient();