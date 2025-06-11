import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('renders input textbox', () => {
    const { getByRole } = render(<NumberOfEvents />);
    const input = getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('input textbox has default value of 32', () => {
    const { getByRole } = render(<NumberOfEvents />);
    const input = getByRole('textbox');
    expect(input).toHaveValue('32');
  });

  test('user can change number of events in textbox', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<NumberOfEvents />);
    const input = getByRole('textbox');
    await user.clear(input);
    await user.type(input, '10');
    expect(input).toHaveValue('10');
  });

  test('input updates correctly when user types backspace + value', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<NumberOfEvents />);
    const input = getByRole('textbox');
    await user.type(input, '{backspace}{backspace}15');
    expect(input).toHaveValue('15');
  });
});
