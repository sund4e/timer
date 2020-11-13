import { act, fireEvent, screen } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import TimeInput, { Props } from './TimeInput';
import { Input } from './timeConverters';

jest.useFakeTimers();

const defaultProps = {
  value: 6574,
  onChange: () => {},
  onFocus: () => {},
  isFocused: true,
  initalFocus: Input.hours,
};

const render = (override?: Partial<Props>) => {
  const props = {
    ...defaultProps,
    ...override,
  };
  return renderElement(<TimeInput {...props} />);
};

describe('TimeInput', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders value', () => {
    const value = 6574;
    render({ value });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs[0]).toHaveTextContent('0');
    expect(inputs[1]).toHaveTextContent('1');
    expect(inputs[2]).toHaveTextContent('4');
    expect(inputs[3]).toHaveTextContent('9');
    expect(inputs[4]).toHaveTextContent('3');
    expect(inputs[5]).toHaveTextContent('4');
  });

  it('updates value', () => {
    const value = 6574;
    const { rerender } = renderElement(
      <TimeInput {...defaultProps} value={value} />
    );
    rerender(<TimeInput {...defaultProps} value={value + 1} />);
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs[5]).toHaveTextContent('5');
  });

  describe('Focusing', () => {
    it('initally focuses the initialFocus', () => {
      render({ initalFocus: Input.minutes });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const input = inputs[2];
      expect(input === document.activeElement).toBeTruthy();
    });
    it('focuses input on click', () => {
      render({ initalFocus: Input.hours });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const input = inputs[2];
      fireEvent.click(input);
      expect(input === document.activeElement).toBeTruthy();
    });

    it('focuses next input after finishing one', () => {
      render();
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      fireEvent.keyPress(inputs[0], {
        key: '1',
        charCode: 49,
      });
      fireEvent.keyPress(inputs[1], {
        key: '5',
        charCode: 53,
      });
      expect(inputs[2] === document.activeElement).toBeTruthy();
    });

    it('focuses next input after pressing right arrow', () => {
      render({ initalFocus: Input.minutes });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      fireEvent.keyDown(window, {
        key: 'ArrowRight',
        charCode: 39,
      });
      expect(inputs[3] === document.activeElement).toBeTruthy();
    });

    it('focuses previoius input after pressing left arrow', () => {
      render({ initalFocus: Input.minutes });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      fireEvent.keyDown(window, {
        key: 'ArrowLeft',
        charCode: 37,
      });
      expect(inputs[1] === document.activeElement).toBeTruthy();
    });
  });

  it('calls onFocus upon clicking input', () => {
    const onFocus = jest.fn();
    render({ onFocus });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.click(inputs[2]);
    expect(onFocus).toHaveBeenCalled();
  });

  describe('onChange', () => {
    it('is called for last input change', () => {
      const onChange = jest.fn();
      render({ onChange });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const input = inputs[inputs.length - 1];
      fireEvent.click(input);
      fireEvent.keyPress(input, {
        key: '5',
        charCode: 53,
      });
      expect(onChange).toHaveBeenCalled();
    });

    it('is called upon enter', () => {
      const onChange = jest.fn();
      const value = 10;
      render({ onChange, value });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const input = inputs[2];
      fireEvent.keyDown(input, {
        key: 'Enter',
        charCode: 13,
      });
      expect(onChange).toHaveBeenCalledWith(value);
    });

    it('is not called for other than last inputs', () => {
      const onChange = jest.fn();
      render({ onChange });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const input = inputs[2];
      fireEvent.click(input);
      fireEvent.keyPress(input, {
        key: '5',
        charCode: 53,
      });
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
