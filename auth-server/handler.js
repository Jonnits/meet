'use strict';

const { google } = require("googleapis");
const calendar = google.calendar("v3");

const SCOPES = ["https://www.googleapis.com/auth/calendar.events.public.readonly"];

const {
  CLIENT_ID,
  CLIENT_SECRET,
  CALENDAR_ID
} = process.env;

function getRedirectUri(event) {
  const ref = event.headers.referer || event.headers.referrer;
  if (!ref) throw new Error('Missing referer header');
  const url = new URL(ref);
  const path = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
  return url.origin + path;
}

module.exports.getAuthURL = async (event) => {
  const redirect = getRedirectUri(event);
  const client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    redirect
  );
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    redirect_uri: redirect
  });
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ authUrl })
  };
};

module.exports.getAccessToken = async (event) => {
  try {
    const code = decodeURIComponent(event.pathParameters.code);
    const redirect = getRedirectUri(event);
    const client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      redirect
    );
    const { tokens } = await client.getToken(code);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
      },
      body: JSON.stringify(tokens)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};

async function listEvents(access_token) {
  const client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  client.setCredentials({ access_token });
  const res = await calendar.events.list({
    calendarId: CALENDAR_ID,
    auth: client,
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: "startTime"
  });
  return res.data.items;
}

module.exports.getEvents = async (event) => {
  try {
    const access_token = decodeURIComponent(event.pathParameters.access_token);
    const events = await listEvents(access_token);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ events })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};

module.exports.getCalendarEvents = module.exports.getEvents;
