import { screen } from '@testing-library/react';
import { render } from '../../tests/render';
import NumberInput from '../NumberInput';

describe('NumberInput', () => {
  it('renders start value', () => {
    const value = 12;
    render(<NumberInput value={value} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue(value.toString());
  });
});
