import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getEvents } from '../api';

const feature = loadFeature('./src/features/filterEventsByCity.feature');

defineFeature(feature, (test) => {
  /* ───────────── Scenario 1 ───────────── */
  test(
    "When user hasn't searched for a city, show upcoming events from all cities",
    ({ given, when, then }) => {
      given("user hasn't searched for any city", () => {});

      when('the user opens the app', () => {
        render(<App />);
      });

      then('the user should see the list of all upcoming events', async () => {
        await waitFor(() =>
          expect(
            screen.queryByText(/Meet is finding your events/i)
          ).not.toBeInTheDocument()
        );
        
        const eventsList = screen.getByRole('list', { name: '' }); // This should be the event list
        const eventItems = within(eventsList).getAllByRole('listitem');
        expect(eventItems).toHaveLength(32);
      });
    }
  );

  /* ───────────── Scenario 2 ───────────── */
  test(
    'User should see a list of suggestions when they search for a city',
    ({ given, when, then }) => {
      let cityBox;

      given('the main page is open', () => {
        render(<App />);
      });

      when('user starts typing in the city textbox', async () => {
        await waitFor(() =>
          expect(
            screen.queryByText(/Meet is finding your events/i)
          ).not.toBeInTheDocument()
        );
        cityBox = await screen.findByPlaceholderText('Search for a city');
        await userEvent.type(cityBox, 'Berlin');
      });

      then(
        "the user should receive a list of cities (suggestions) that match what they've typed",
        async () => {

          await waitFor(() => {
            const suggestionsContainer = screen.getByDisplayValue('Berlin').closest('#city-search');
            const suggestions = within(suggestionsContainer).getAllByRole('listitem');
            expect(suggestions).toHaveLength(2);
          });
        }
      );
    }
  );

  /* ───────────── Scenario 3 ───────────── */
  test(
    'User can select a city from the suggested list',
    ({ given, and, when, then }) => {
      let cityBox, suggestionsContainer;

      given('user was typing "Berlin" in the city textbox', async () => {
        render(<App />);
        await waitFor(() =>
          expect(
            screen.queryByText(/Meet is finding your events/i)
          ).not.toBeInTheDocument()
        );
        cityBox = await screen.findByPlaceholderText('Search for a city');
        await userEvent.type(cityBox, 'Berlin');
        
        suggestionsContainer = screen.getByDisplayValue('Berlin').closest('#city-search');
      });

      and('the list of suggested cities is showing', () => {
        const items = within(suggestionsContainer).getAllByRole('listitem');
        expect(items).toHaveLength(2);
      });

      when(
        'the user selects a city (e.g., "Berlin, Germany") from the list',
        async () => {
          const berlinLi = within(suggestionsContainer).getByText(/Berlin, Germany/i);
          await userEvent.click(berlinLi);
        }
      );

      then(
        'their city should be changed to that city (i.e., "Berlin, Germany")',
        () => {
          expect(cityBox.value).toBe('Berlin, Germany');
        }
      );

      and(
        'the user should receive a list of upcoming events in that city',
        async () => {
          await waitFor(() =>
            expect(
              screen.queryByText(/Meet is finding your events/i)
            ).not.toBeInTheDocument()
          );
          
          const eventsList = screen.getByRole('list', { name: '' });
          const displayedEvents = within(eventsList).getAllByRole('listitem');
          
          const berlinEvents = (await getEvents()).filter((e) =>
            e.location.includes('Berlin')
          );
          expect(displayedEvents).toHaveLength(berlinEvents.length);
        }
      );
    }
  );
});