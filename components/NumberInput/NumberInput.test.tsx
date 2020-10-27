import { fireEvent, screen } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import NumberInput, { Props } from './NumberInput';

jest.useFakeTimers();

fdescribe('NumberInput', () => {
  const render = (override: Partial<Props>) => {
    const defaultProps = {
      size: 2,
      value: 0,
      onChange: () => {},
      isFocused: true,
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
    render({ onChange, value: 11 });
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], {
      target: { value: '2' },
    });
    expect(onChange).toHaveBeenCalledWith(21, false);
  });

  it('calls onChange correctly when changing last input', () => {
    const onChange = jest.fn();
    render({ onChange, value: 11 });
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], {
      target: { value: '2' },
    });
    expect(onChange).toHaveBeenCalledWith(12, true);
  });

  it('does not allow inputting letters', () => {
    const onChange = jest.fn();
    render({ value: 22, onChange });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.change(inputs[0], {
      target: { value: 'a' },
    });
    expect(inputs[0]).toHaveValue('2');
    expect(onChange).not.toHaveBeenCalled();
  });

  describe('isFocused', () => {
    it('focuses first input initially if true', () => {
      render({ isFocused: true });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      expect(inputs[0] === document.activeElement).toEqual(true);
    });

    it('focuses next input after change if true', () => {
      render({ isFocused: true });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      fireEvent.change(inputs[0], {
        target: { value: '2' },
      });
      expect(inputs[1] === document.activeElement).toEqual(true);
    });

    it('does not focus any input if false', () => {
      render({ isFocused: false });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const isFocused = inputs.some(
        (input) => input === document.activeElement
      );
      expect(isFocused).toBe(false);
    });
  });
});
