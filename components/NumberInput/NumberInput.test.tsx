import { fireEvent, screen, act } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import NumberInput, { Props } from './NumberInput';

describe('NumberInput', () => {
  const render = (override: Partial<Props>) => {
    const defaultProps = {
      size: 2,
      value: 0,
      onChange: () => {},
      isFocused: true,
      onClick: () => {},
      ...override,
    };
    return renderElement(<NumberInput {...defaultProps} />);
  };
  it('renders start value', () => {
    const value = 45;
    render({ value });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs.length).toEqual(2);
    expect(inputs[0]).toHaveTextContent('4');
    expect(inputs[1]).toHaveTextContent('5');
  });

  it('calls onChange correctly when changing other than last input', () => {
    const onChange = jest.fn();
    render({ onChange, value: 11 });
    const inputs = screen.getAllByRole('textbox');
    fireEvent.keyPress(inputs[0], {
      key: '2',
      charCode: 50,
    });
    expect(onChange).toHaveBeenCalledWith(21, false);
  });

  it('calls onChange correctly when changing last input', () => {
    const onChange = jest.fn();
    render({ onChange, value: 11 });
    const inputs = screen.getAllByRole('textbox');
    fireEvent.click(inputs[1]);
    fireEvent.keyPress(inputs[1], {
      key: '2',
      charCode: 50,
    });
    expect(onChange).toHaveBeenCalledWith(12, true);
  });

  it('does not allow inputting letters', () => {
    const onChange = jest.fn();
    render({ value: 22, onChange });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.keyPress(inputs[0], {
      key: 'a',
      charCode: 65,
    });
    expect(inputs[0]).toHaveTextContent('2');
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
      fireEvent.keyPress(inputs[0], {
        key: '2',
        charCode: 50,
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

  it('calls onClick when one of onputs is clicked', () => {
    const onClick = jest.fn();
    render({ onClick });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.click(inputs[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
