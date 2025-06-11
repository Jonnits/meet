import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';
import mockData from '../mock-data';

describe('<Event /> component', () => {
  let event;
  beforeEach(() => {
    event = mockData.items[0]; // use sample event?
  });

  test('renders event summary (title)', () => {
    const { queryByText } = render(<Event event={event} />);
    expect(queryByText(event.summary)).toBeInTheDocument();
  });

  test('renders event start time', () => {
    const { queryByText } = render(<Event event={event} />);
    expect(queryByText(new Date(event.created).toString())).toBeInTheDocument();
  });

  test('renders event location', () => {
    const { queryByText } = render(<Event event={event} />);
    expect(queryByText(event.location)).toBeInTheDocument();
  });

  test('renders show details button', () => {
    const { queryByText } = render(<Event event={event} />);
    expect(queryByText(/show details/i)).toBeInTheDocument();
  });

  test('event details are collapsed by default', () => {
    const { queryByText } = render(<Event event={event} />);
    expect(queryByText(event.description)).not.toBeInTheDocument();
  });

  test('user can expand event to see details', async () => {
    const user = userEvent.setup();
    const { getByText, container } = render(<Event event={event} />);
    const showButton = getByText(/show details/i);
    await user.click(showButton);
  
    const detailsEl = container.querySelector('.event-details');
    expect(detailsEl.textContent).toContain(event.description);
  });

  test('user can collapse event to hide details', async () => {
    const user = userEvent.setup();
    const { container, getByText } = render(<Event event={event} />);
    await user.click(getByText(/show details/i));
    await user.click(getByText(/hide details/i));
  
    expect(container.querySelector('.event-details')).not.toBeInTheDocument();
  });  
  
});
