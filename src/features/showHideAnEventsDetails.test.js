import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {
  test('An event element is collapsed by default', ({ given, when, then }) => {
    let AppComponent;
    let AppDOM;
    let EventListDOM;

    given('the user opens the app', () => {
      AppComponent = render(<App />);
      AppDOM = AppComponent.container.firstChild;
    });

    when('the user receives the full list of events (all events)', async () => {
      await waitFor(() => {
        EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).toBeInTheDocument();
      });
      
      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBe(32);
      });
    });

    then('all events will be collapsed by default', () => {
      const EventListItems = within(EventListDOM).queryAllByRole('listitem');
      EventListItems.forEach(event => {
        expect(event.querySelector('.event-details')).not.toBeInTheDocument();
      });
    });
  });

  test('User can expand an event to see its details', ({ given, when, then }) => {
    let AppComponent;
    let AppDOM;
    let EventListDOM;
    let EventListItems;

    given('the user gets a list of events', async () => {
      AppComponent = render(<App />);
      AppDOM = AppComponent.container.firstChild;
      
      await waitFor(() => {
        EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).toBeInTheDocument();
      });
      
      await waitFor(() => {
        EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBe(32);
      });
    });

    when('a user selects an event\'s details', async () => {
      const user = userEvent.setup();
      const firstEvent = EventListItems[0];
      const detailsButton = within(firstEvent).queryByText('Show Details');
      await user.click(detailsButton);
    });

    then('the details will be shown', () => {
      const firstEvent = EventListItems[0];
      const eventDetails = firstEvent.querySelector('.event-details');
      expect(eventDetails).toBeInTheDocument();
    });
  });

  test('User can collapse an event to hide its details', ({ given, when, then }) => {
    let AppComponent;
    let AppDOM;
    let EventListDOM;
    let EventListItems;
    let firstEvent;

    given('the user sees the details of an event', async () => {
      const user = userEvent.setup();
      AppComponent = render(<App />);
      AppDOM = AppComponent.container.firstChild;
      
      await waitFor(() => {
        EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).toBeInTheDocument();
      });
      
      await waitFor(() => {
        EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBe(32);
      });

      firstEvent = EventListItems[0];
      const detailsButton = within(firstEvent).queryByText('Show Details');
      await user.click(detailsButton);
      
      expect(firstEvent.querySelector('.event-details')).toBeInTheDocument();
    });

    when('the user presses a button to hide event\'s details', async () => {
      const user = userEvent.setup();
      const hideDetailsButton = within(firstEvent).queryByText('Hide Details');
      await user.click(hideDetailsButton);
    });

    then('the details will be hidden', () => {
      expect(firstEvent.querySelector('.event-details')).not.toBeInTheDocument();
    });
  });
});