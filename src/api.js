import mockData from './mock-data';


export const extractLocations = (events) => {
  const eventArray = events.items || events;
  const extractedLocations = eventArray.map((event) => event.location);
  const locations = [...new Set(extractedLocations)];
  return locations;
};

export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = await searchParams.get("code");
    if (!code) {
      const response = await fetch(
        "https://sdr1kj1q36.execute-api.us-west-2.amazonaws.com/dev/api/get-auth-url"
      );
      const result = await response.json();
      const { authUrl } = result;
      return (window.location.href = authUrl);
    }
    return code && getToken(code);
  }
  return accessToken;
};

export const getEvents = async () => {
  if (window.location.href.startsWith("http://localhost")) {
    console.log("[getEvents] Using local mock data.");
    return mockData.items;
  }

  try {
    const token = await getAccessToken();
    if (!token) {
      console.warn("[getEvents] No access token retrieved.");
      return [];
    }

    removeQuery(); 

    const url = `https://sdr1kj1q36.execute-api.us-west-2.amazonaws.com/dev/api/get-events/${token}`;
    console.log(`[getEvents] Fetching events from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`[getEvents] API response not ok: ${response.status}`);
    }

    const result = await response.json();
    console.log("[getEvents] Fetched result:", result);

    if (Array.isArray(result.events)) {
      return result.events;
    } else if (Array.isArray(result)) {
      console.warn("[getEvents] Expected 'events' key, got array directly.");
      return result;
    } else {
      console.error("[getEvents] Unexpected response format:", result);
    }

  } catch (error) {
    console.error("[getEvents] Error occurred:", error);
  }

  return [];
};


const removeQuery = () => {
  const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  window.history.pushState("", "", newurl);
};

const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const response = await fetch(
    `https://sdr1kj1q36.execute-api.us-west-2.amazonaws.com/dev/api/token/${encodeCode}`
  );
  const { access_token } = await response.json();
  if (access_token) {
    localStorage.setItem("access_token", access_token);
  }
  return access_token;
};

const checkToken = async (accessToken) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  );
  const result = await response.json();
  return result;
};
