require("isomorphic-fetch");
const graph = require('@microsoft/microsoft-graph-client');
const authService = require('./auth');

let client;

function initClient() {
  const accessToken = authService.getAccessToken();
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

module.exports = {
  getClient: getClient
};