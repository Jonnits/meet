import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, test => {
  test('When user hasn\'t specified a number, 32 is the default number', ({ given, when, then }) => {
    let AppComponent;
    let AppDOM;

    given('the user hasn\'t specified or filtered the number of events', () => {
      AppComponent = render(<App />);
      AppDOM = AppComponent.container.firstChild;
    });

    when('the user sees the list of events', async () => {
      const EventListDOM = AppDOM.querySelector('#event-list');
      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBe(32);
      });
    });

    then('the default number of displayed events will be 32', () => {
      const EventListDOM = AppDOM.querySelector('#event-list');
      const EventListItems = within(EventListDOM).queryAllByRole('listitem');
      expect(EventListItems.length).toBe(32);
    });
  });

  test('User can change the number of events they want to see', ({ given, when, then }) => {
    let AppComponent;
    let AppDOM;
    let NumberOfEventsDOM;
    let NumberOfEventsInput;

    given('the user has events displayed', async () => {
      AppComponent = render(<App />);
      AppDOM = AppComponent.container.firstChild;
      
      const EventListDOM = AppDOM.querySelector('#event-list');
      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBe(32);
      });
    });

    when('the user changes the number of events displayed', async () => {
      const user = userEvent.setup();
      NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
      NumberOfEventsInput = within(NumberOfEventsDOM).queryByRole('textbox');
      
      await user.type(NumberOfEventsInput, '{backspace}{backspace}10');
    });

    then('the number of events displayed will update to match the user\'s selection', async () => {
      const EventListDOM = AppDOM.querySelector('#event-list');
      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBe(10);
      });
    });
  });
});