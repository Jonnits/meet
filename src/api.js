// src/api.js
import mockData from './mock-data';

export const CLIENT_ID = '761768765907-5p7492mkjikncr7cstanrjt9uib56nig.apps.googleusercontent.com';
export const API_KEY   = 'AIzaSyDMjMKz1eVDuqzla9XV2-jN8_ehOPBSngw';

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];
const SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly';

let gapiInited = false;

function loadGapiScript() {
  if (typeof window === 'undefined' || window.gapi) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src   = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload  = () => resolve();
    script.onerror = () => reject(new Error('Failed to load gapi script'));
    document.body.appendChild(script);
  });
}

async function initGapiClient() {
  if (gapiInited) return;
  await loadGapiScript();
  await new Promise((resolve, reject) => {
    window.gapi.load('client:auth2', async () => {
      try {
        await window.gapi.client.init({
          apiKey:       API_KEY,
          clientId:     CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope:         SCOPES,
        });
        gapiInited = true;
        resolve();
      } catch (err) {
        console.error('Error initializing gapi client', err);
        reject(err);
      }
    });
  });
}

async function ensureSignedIn() {
  const auth = window.gapi.auth2.getAuthInstance();
  if (!auth.isSignedIn.get()) {
    await auth.signIn();
  }
}

export async function getEvents() {
  if (
    process.env.NODE_ENV === 'test' ||
    window.location.href.startsWith('http://localhost')
  ) {
    return mockData.items;
  }

  try {
    await initGapiClient();
    await ensureSignedIn();

    const resp = await window.gapi.client.calendar.events.list({
      calendarId:  'primary',
      timeMin:     new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults:  2500,
      orderBy:     'startTime',
    });
    return resp.result.items || [];
  } catch (err) {
    console.error('getEvents error:', err);
    return [];
  }
}

export function extractLocations(events) {
  const arr = Array.isArray(events) ? events : events.items || [];
  const locs = arr.map(e => e.location).filter(Boolean);
  return Array.from(new Set(locs));
}
