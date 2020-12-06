import { fireEvent, screen, act } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import NumberInput, { Props } from './NumberInput';

describe('NumberInput', () => {
  const render = (override: Partial<Props>) => {
    const defaultProps = {
      size: 2,
      value: 0,
      onChange: () => {},
      focusIndex: 0,
      onClick: () => {},
      invalidFocus: false,
      ...override,
    };
    return renderElement(<NumberInput {...defaultProps} />);
  };
  it('renders start value', () => {
    const value = 45;
    render({ value });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs.length).toEqual(2);
    expect(inputs[0].value).toEqual('4');
    expect(inputs[1].value).toEqual('5');
  });

  it('calls onChange correctly when changing other than last input', () => {
    const onChange = jest.fn();
    render({ onChange, value: 11, focusIndex: 0 });
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '2' } });
    expect(onChange).toHaveBeenCalledWith(21);
  });

  it('calls onChange correctly when changing last input', () => {
    const onChange = jest.fn();
    render({ onChange, value: 11, focusIndex: 1 });
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: '2' } });
    expect(onChange).toHaveBeenCalledWith(12);
  });

  it('does not allow inputting letters', () => {
    const onChange = jest.fn();
    render({ value: 22, onChange });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: 'a' } });
    expect(inputs[0].value).toEqual('2');
    expect(onChange).not.toHaveBeenCalled();
  });

  describe('focusIndex', () => {
    it('focuses first input if 0', () => {
      render({ focusIndex: 0 });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      expect(inputs[0] === document.activeElement).toEqual(true);
    });

    it('focuses second input if 1', () => {
      render({ focusIndex: 1 });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      fireEvent.change(inputs[0], { target: { value: '2' } });
      expect(inputs[1] === document.activeElement).toEqual(true);
    });

    it('does not focus any input if undefined', () => {
      render({ focusIndex: undefined });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const isFocused = inputs.some(
        (input) => input === document.activeElement
      );
      expect(isFocused).toBe(false);
    });
  });

  it('calls onClick when one of onputs is clicked', () => {
    const onClick = jest.fn();
    render({ onClick });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.click(inputs[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
