const credentials = {
  client: {
    id: process.env.OUTLOOK_CLIENT_ID,
    secret: process.env.OUTLOOK_CLIENT_SECRETE,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
};
const oauth2 = require('simple-oauth2').create(credentials);
const fs = require('fs');
const envfile = require('envfile');

function getAuthUrl() {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
    scope: process.env.OUTLOOK_SCOPES
  });
  console.log(`Generated auth url: ${returnVal}`);
  return returnVal;
}

async function getTokenFromCode(auth_code) {
  let result = await oauth2.authorizationCode.getToken({
    code: auth_code,
    redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
    scope: process.env.OUTLOOK_SCOPES
  });
  const token = oauth2.accessToken.create(result);
  console.log('Token created: ', token.token);
  return token.token.access_token;
}

async function getAccessToken() {
  let accessToken = process.env.OUTLOOK_AUTH_ACCESS_TOKEN;
  if (accessToken) {
    const FIVE_MINUTE = 300000;
    const expiration = new Date(parseInt(process.env.OUTLOOK_AUTH_EXPIRES_TIME) - FIVE_MINUTE);
    if (expiration > new Date()) {
      return accessToken;
    } else {
      console.log('AccessToken has expired.');
    }
  }
  const refreshToken = process.env.OUTLOOK_AUTH_REFRESH_TOKEN;
  if (refreshToken) {
    console.log('Requesting new AccessToken with RefreshToken');
    const token = await oauth2.accessToken.create({refresh_token: refreshToken}).refresh();
    const envFile = envfile.parseFileSync('.env');
    envFile.OUTLOOK_AUTH_ACCESS_TOKEN = token.token.access_token;
    envFile.OUTLOOK_AUTH_REFRESH_TOKEN = token.token.refresh_token;
    envFile.OUTLOOK_AUTH_EXPIRES_TIME = token.token.expires_at.getTime();
    fs.writeFileSync('.env', envfile.stringifySync(envFile));
    return token.token.access_token;
  } else {
    console.log('No RefreshToken found in .env. Please re-do the oauth again.')
  }
}

module.exports = {
  getAuthUrl: getAuthUrl,
  getTokenFromCode: getTokenFromCode,
  getAccessToken: getAccessToken
};