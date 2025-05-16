# Meet App

A **serverless**, **progressive web application (PWA)** built with **React** that uses the **Google Calendar API** to fetch and display upcoming events. Users can filter events by city, specify how many events they want to see, view or hide event details, and explore visual insights through charts. The app also works offline and can be installed to the home screen like a native app.

## Project Description

Meet App is designed to provide a responsive and intuitive way for users to find and explore upcoming events in different cities. Built with a mobile-first approach and enhanced with service workers and caching strategies, the app offers offline functionality and installable features, ensuring a seamless experience on any device. It uses test-driven development (TDD) practices to ensure stability and maintainability.

---

## User Stories

- **Filter Events by City**  
  As a user, I should be able to filter events by city, so that I can see a list of events taking place in that city.

- **Show/Hide Event Details**  
  As a user, I should be able to show or hide the details of an event, so that I can choose to see more or less information depending on my interest.

- **Specify Number of Events**  
  As a user, I should be able to specify how many events I want to see at once, so that I can control the length of the event list to match my preferences or screen size.

- **Use the App When Offline**  
  As a user, I should be able to access the app and view previously loaded events even when I’m offline, so that I can still use the app without access to an internet connection.

- **Add an App Shortcut to the Home Screen**  
  As a user, I should be able to add the app to my device's home screen, so that I can launch it quickly like a native mobile app.

- **Display Charts Visualizing Event Details**  
  As a user, I should be able to view charts that visualize event data (such as number of events per city), so that I can better understand trends and distributions in the events.

---

## Feature Scenarios

### Feature: Filter Events By City

**Scenario 1:** When user hasn’t searched for a city, show upcoming events from all cities.

```
Given the user opens the events app;
When the user has not searched for a city;
Then the app should display upcoming events from all cities.
```

**Scenario 2:** User should see a list of suggestions when they search for a city.

```
Given the user is typing a city name into the search box;
When the input matches one or more cities;
Then the user should see a list of suggested cities.
```

**Scenario 3:** User can select a city from the suggested list.

```
Given the user sees a list of suggested cities;
When the user selects a city from the list;
Then the app should display upcoming events from that selected city.
```

---

### Feature: Show/Hide Event Details

**Scenario 1:** An event element is collapsed by default.

```
Given the user is viewing the list of events;
When the user scrolls up or down the list;
Then each event element should be collapsed by default.
```

**Scenario 2:** User can expand an event to see details.

```
Given the user is viewing the list of events;
When the user clicks on an event's "Show Details" button;
Then the event should expand to display more details.
```

**Scenario 3:** User can collapse an event to hide details.

```
Given an event is expanded to show details;
When the user clicks on the "Hide Details" button;
Then the event should collapse and hide the details.
```

---

### Feature: Specify Number of Events

**Scenario 1:** When user hasn’t specified a number, 32 events are shown by default.

```
Given the user is on the events app;
When the user doesn't specify a number of events;
Then 32 events should be displayed by default.
```

**Scenario 2:** User can change the number of events displayed.

```
Given the user is on the events app;
When the user specifies a number of events to display;
Then that number of events should be displayed.
```

---

### Feature: Use the App When Offline

**Scenario 1:** Show cached data when there’s no internet connection.

```
Given the user has previously opened the app with internet access and the app has cached data;
When the user opens the app without an internet connection;
Then the app should display the cached event data.
```

**Scenario 2:** Show error when user changes search settings (city, number of events).

```
Given the user is offline;
When the user tries to change the city or number of events;
Then the app should display an error message indicating that new data cannot be retrieved.
```

---

### Feature: Add an App Shortcut to the Home Screen

**Scenario:** User can install the meet app as a shortcut on their device home screen.

```
Given the user is using a supported device and browser;
When the browser prompts the user to install the app and the user accepts the prompt;
Then the app should be added as a shortcut to the user's home screen.
```

---

### Feature: Display Charts Visualizing Event Details

**Scenario:** Show a chart with the number of upcoming events in each city.

```
Given the user is viewing the events page;
When events are loaded;
Then the app should display a chart showing the number of upcoming events in each city.
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v18 or higher recommended)
- npm or yarn
- A Google API key with access to the Google Calendar API

---

## Dependencies

- **React** – Frontend framework
- **React Testing Library / Jest** – For unit and integration testing
- **Recharts** – For rendering charts and visualizations
- **Google Calendar API** – For fetching event data
- **Workbox** – For offline functionality and service workers
- **PWA Support (Manifest, Service Worker)** – For installable features
- **Enzyme (if used)** – For additional component testing

---
