import { render, within, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import App from './../App';

describe('<App /> component', () => {
    let AppDOM;
    beforeEach(async () => {
        const AppComponent = render(<App />);
        AppDOM = AppComponent.container.firstChild;
        
        await waitFor(() => {
            expect(AppDOM.querySelector('#event-list')).toBeInTheDocument();
        });
    });

    test('renders list of events', () => {
        expect(AppDOM.querySelector('#event-list')).toBeInTheDocument();
    });

    test('render CitySearch', () => {
        expect(AppDOM.querySelector('#city-search')).toBeInTheDocument();
    });

    test('renders NumberOfEvents component', () => {
        expect(AppDOM.querySelector('#number-of-events')).toBeInTheDocument();
    });
});

describe('<App /> integration', () => {
    test('renders a list of events matching the city selected by the user', async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;
        
        await waitFor(() => {
            expect(AppDOM.querySelector('#city-search')).toBeInTheDocument();
        });
     
        const CitySearchDOM = AppDOM.querySelector('#city-search');
        const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');
     
        await user.type(CitySearchInput, "Berlin");
        
        await waitFor(() => {
            const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
            expect(berlinSuggestionItem).toBeInTheDocument();
        });
        
        const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
        await user.click(berlinSuggestionItem);
     
        const EventListDOM = AppDOM.querySelector('#event-list');
        const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');  
     
        const allEvents = await getEvents();
        const berlinEvents = allEvents.filter(
          event => event.location === 'Berlin, Germany'
        );
     
        expect(allRenderedEventItems.length).toBe(berlinEvents.length);
        allRenderedEventItems.forEach(event => {
            expect(event.textContent).toContain("Berlin, Germany");
        });
    });

    test('renders the number of events specified by the user', async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;

        await waitFor(() => {
            expect(AppDOM.querySelector('#number-of-events')).toBeInTheDocument();
        });

        const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
        const NumberOfEventsInput = within(NumberOfEventsDOM).queryByRole('textbox');

        await user.type(NumberOfEventsInput, "{backspace}{backspace}10");

        const EventListDOM = AppDOM.querySelector('#event-list');
        
        await waitFor(() => {
            const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');
            expect(allRenderedEventItems.length).toBe(10);
        });
    });
});