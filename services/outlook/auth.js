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
    client_id: process.env.OUTLOOK_CLIENT_ID,
    redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
    scope: process.env.OUTLOOK_SCOPES
  });
  console.log(`Generated auth url: ${returnVal}`);
  return returnVal;
}

async function getTokenFromCode(auth_code) {
  try {
    const result = await oauth2.authorizationCode.getToken({
      client_id: process.env.OUTLOOK_CLIENT_ID,
      client_secret: process.env.OUTLOOK_CLIENT_SECRETE,
      code: auth_code,
      redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
      scope: process.env.OUTLOOK_SCOPES
    });
    const token = oauth2.accessToken.create(result);
    console.log('Token created: ', token.token);
    saveTokens(token.token.access_token, token.token.refresh_token, token.token.expires_at.getTime());
    return token.token.access_token;
  } catch (err) {
    console.error(`Failed to create tokens form auth code:${err}`);
  }
}

function isAccessTokenExpired() {
  const FIVE_MINUTE = 300000;
  const expiration = new Date(parseInt(process.env.OUTLOOK_AUTH_EXPIRES_TIME) - FIVE_MINUTE);
  return expiration < new Date();
}

async function getAccessToken() {
  let accessToken = process.env.OUTLOOK_AUTH_ACCESS_TOKEN;
  if (accessToken) {
    if (!isAccessTokenExpired()) {
      return accessToken;
    } else {
      console.warn('AccessToken has expired.');
    }
  }
  const refreshToken = process.env.OUTLOOK_AUTH_REFRESH_TOKEN;
  if (refreshToken) {
    try {
      console.log('Requesting new AccessToken with RefreshToken...');
      const token = await oauth2.accessToken.create({refresh_token: refreshToken}).refresh();
      saveTokens(token.token.access_token, token.token.refresh_token, token.token.expires_at.getTime());
      return token.token.access_token;
    } catch (err) {
      console.error(`Failed to refresh token: ${err}`)
    }
  } else {
    console.error('No RefreshToken found in .env. Please re-do the oauth again.')
  }
}

function saveTokens(accessToken, refreshToken, expiresTime) {
  const envFile = envfile.parseFileSync('.env');
  process.env.OUTLOOK_AUTH_ACCESS_TOKEN = accessToken;
  process.env.OUTLOOK_AUTH_REFRESH_TOKEN = refreshToken;
  process.env.OUTLOOK_AUTH_EXPIRES_TIME = expiresTime;
  envFile.OUTLOOK_AUTH_ACCESS_TOKEN = accessToken;
  envFile.OUTLOOK_AUTH_REFRESH_TOKEN = refreshToken;
  envFile.OUTLOOK_AUTH_EXPIRES_TIME = expiresTime;
  fs.writeFileSync('.env', envfile.stringifySync(envFile));
  console.log('Tokens saved.')
}

module.exports = {
  getAuthUrl: getAuthUrl,
  getTokenFromCode: getTokenFromCode,
  getAccessToken: getAccessToken,
  isAccessTokenExpired: isAccessTokenExpired
};