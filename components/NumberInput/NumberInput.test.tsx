import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../tests/render';
import NumberInput from '../NumberInput';

describe('NumberInput', () => {
  it('renders start value', () => {
    const value = 12;
    render(<NumberInput value={value} onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue(value.toString());
  });

  it('calls onChange correctly when changing tens', () => {
    const onChange = jest.fn();
    const newValue = '100';
    render(<NumberInput value={0} onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, {
      target: { value: newValue },
    });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('calls onChange correctly when changing ones', () => {
    const onChange = jest.fn();
    const newValue = '12';
    render(<NumberInput value={10} onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, {
      target: { value: newValue },
    });
    expect(onChange).toHaveBeenCalledWith(12);
  });
});
