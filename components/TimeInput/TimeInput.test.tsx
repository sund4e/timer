import { fireEvent, screen } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import TimeInput, { Props } from './TimeInput';
import { Input } from './timeConverters';
import { changeInputValue, enter, getTime } from '../../tests/helpers';

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
    expect(getTime()).toEqual('01:49:34');
  });

  it('updates value', () => {
    const value = 6574;
    const { rerender } = renderElement(
      <TimeInput {...defaultProps} value={value} />
    );
    rerender(<TimeInput {...defaultProps} value={value + 1} />);
    expect(getTime()).toEqual('01:49:35');
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
      render({ initalFocus: Input.hours });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      changeInputValue(0, 1);
      changeInputValue(1, 5);
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

  describe('onFocus', () => {
    it('is called upon clicking input', () => {
      const onFocus = jest.fn();
      render({ onFocus });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      fireEvent.click(inputs[2]);
      expect(onFocus).toHaveBeenCalled();
    });

    it('is called when unfocused and enter is hit', () => {
      const onFocus = jest.fn();
      render({ onFocus, isFocused: false });
      enter();
      expect(onFocus).toHaveBeenCalled();
    });
  });

  describe('onChange', () => {
    it('is not called when changed input is not the last', () => {
      const onChange = jest.fn();
      render({ onChange });
      changeInputValue(2, 5);
      expect(onChange).not.toHaveBeenCalledTimes(1);
    });
    it('is called when last input changes', () => {
      const onChange = jest.fn();
      render({ onChange });
      changeInputValue(5, 5);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('is called on enter', () => {
      const onChange = jest.fn();
      render({ onChange, isFocused: true });
      enter();
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
