import { fireEvent, screen } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import NumberInput, { Props } from './NumberInput';

jest.useFakeTimers();

describe('NumberInput', () => {
  const render = (override: Partial<Props>) => {
    const defaultProps = {
      size: 2,
      value: 0,
      onChange: () => {},
      ...override,
    };
    renderElement(<NumberInput {...defaultProps} />);
  };
  it('renders start value', () => {
    const value = 12;
    render({ value });
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue(value.toString());
  });

  it('calls onChange correctly when changing tens', () => {
    const onChange = jest.fn();
    const newValue = '100';
    render({ onChange, value: 0 });
    const input = screen.getByRole('textbox');
    fireEvent.change(input, {
      target: { value: newValue },
    });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('calls onChange correctly when changing ones', () => {
    const onChange = jest.fn();
    const newValue = '12';
    render({ onChange, value: 0 });
    const input = screen.getByRole('textbox');
    fireEvent.change(input, {
      target: { value: newValue },
    });
    expect(onChange).toHaveBeenCalledWith(12);
  });

  it('sets cursor corretly', () => {
    const newValue = '222';
    render({ value: 0 });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: newValue },
    });
    jest.runAllTimers();
    expect(input.selectionStart).toEqual(1);
  });

  it('does not allow inputting letters', () => {
    const value = 22;
    const newValue = '2a2';
    const onChange = jest.fn();
    render({ value, onChange });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: newValue },
    });
    expect(input).toHaveValue(value.toString());
    expect(onChange).not.toHaveBeenCalled();
  });

  describe('isFocused', () => {
    it('focuses input if true', () => {
      const isFocused = true;
      render({ isFocused });
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input).toHaveFocus();
    });

    it('focuses input if false', () => {
      const isFocused = false;
      render({ isFocused });
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input).not.toHaveFocus();
    });
  });
});
