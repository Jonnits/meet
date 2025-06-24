// src/api.js

export const CLIENT_ID = '761768765907-5p7492mkjikncr7cstanrjt9uib56nig.apps.googleusercontent.com';
export const API_KEY   = 'AIzaSyDMjMKz1eVDuqzla9XV2-jN8_ehOPBSngw';

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly';

export function initGapiClient() {
  return new Promise((resolve, reject) => {

    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        });
        resolve();
      } catch (err) {
        console.error('Error initializing gapi client', err);
        reject(err);
      }
    });
  });
}

async function ensureSignedIn() {
  const auth = gapi.auth2.getAuthInstance();
  if (!auth) throw new Error('gapi not initialized');
  if (!auth.isSignedIn.get()) {
    await auth.signIn();
  }
}

export async function getEvents() {
 
  if (!gapi.client) {
    await initGapiClient();
  }

  await ensureSignedIn();
 
  const resp = await gapi.client.calendar.events.list({
    calendarId:     'primary',
    timeMin:        new Date().toISOString(), // only future events
    showDeleted:    false,
    singleEvents:   true,
    maxResults:     2500,
    orderBy:        'startTime',
  });
  return resp.result.items || [];
}

export function extractLocations(events) {
  const locs = events.map(e => e.location).filter(Boolean);
  return Array.from(new Set(locs));
}
