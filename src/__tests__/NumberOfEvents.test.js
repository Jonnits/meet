import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  const mockSetErrorAlert = jest.fn();

  beforeEach(() => {
    mockSetErrorAlert.mockClear();
  });

  test('renders input textbox', () => {
    const { getByRole } = render(<NumberOfEvents setErrorAlert={mockSetErrorAlert} />);
    const input = getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('input textbox has default value of 32', () => {
    const { getByRole } = render(<NumberOfEvents setErrorAlert={mockSetErrorAlert} />);
    const input = getByRole('textbox');
    expect(input).toHaveValue('32');
  });

  test('user can change number of events in textbox', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<NumberOfEvents setErrorAlert={mockSetErrorAlert} />);
    const input = getByRole('textbox');
    await user.clear(input);
    await user.type(input, '10');
    expect(input).toHaveValue('10');
  });

  test('input updates correctly when user types backspace + value', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<NumberOfEvents setErrorAlert={mockSetErrorAlert} />);
    const input = getByRole('textbox');
    await user.type(input, '{backspace}{backspace}15');
    expect(input).toHaveValue('15');
  });

  test('calls setErrorAlert with error message when invalid input is entered', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<NumberOfEvents setErrorAlert={mockSetErrorAlert} />);
    const input = getByRole('textbox');
    
    await user.clear(input);
    await user.type(input, '-5');
    
    expect(mockSetErrorAlert).toHaveBeenCalledWith('Only positive numbers are allowed');
  });

  test('calls setErrorAlert with error message when non-numeric input is entered', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<NumberOfEvents setErrorAlert={mockSetErrorAlert} />);
    const input = getByRole('textbox');
    
    await user.clear(input);
    await user.type(input, 'abc');
    
    expect(mockSetErrorAlert).toHaveBeenCalledWith('Only positive numbers are allowed');
  });

  test('clears error alert when valid input is entered', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<NumberOfEvents setErrorAlert={mockSetErrorAlert} />);
    const input = getByRole('textbox');
    
    await user.clear(input);
    await user.type(input, '20');
    
    expect(mockSetErrorAlert).toHaveBeenCalledWith('');
  });
});