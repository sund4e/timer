import { fireEvent, screen } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import TimeInput, { Props, getSecondsFromDigits } from './TimeInput';
import { changeInputValue, enter, getTimes } from '../../tests/helpers';
import { act } from 'react';

jest.useFakeTimers();

const defaultProps: Omit<Props, 'onBlur'> = {
  value: 6574,
  onChange: () => {},
  onFocus: () => {},
  isFocused: true,
};

const render = (override?: Partial<Props>) => {
  const props: Props = {
    ...defaultProps,
    onBlur: jest.fn(),
    ...override,
  };
  return renderElement(<TimeInput {...props} />);
};

describe('getSecondsFromDigits', () => {
  it('returns correct seconds', () => {
    expect(getSecondsFromDigits([0, 1, 4, 9, 3, 4])).toEqual(6574);
  });
});

const getTime = () => getTimes()[0]; // Assume only one timer

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
      <TimeInput {...defaultProps} value={value} onBlur={jest.fn()} />
    );
    rerender(
      <TimeInput {...defaultProps} value={value + 1} onBlur={jest.fn()} />
    );
    expect(getTime()).toEqual('01:49:35');
  });

  describe('Focusing', () => {
    it('calls onFocus on click', () => {
      const onFocus = jest.fn();
      render({ onFocus, isFocused: false });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const input = inputs[2];
      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalled();
    });

    it('focuses next input after finishing one', () => {
      render({ isFocused: true });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      changeInputValue(0, 1);
      expect(inputs[1] === document.activeElement).toBeTruthy();
      changeInputValue(1, 5);
      expect(inputs[2] === document.activeElement).toBeTruthy();
    });

    it('focuses next input after pressing right arrow', () => {
      render();
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      inputs[2].focus();
      expect(inputs[2] === document.activeElement).toBeTruthy();
      fireEvent.keyDown(inputs[2], {
        key: 'ArrowRight',
      });
      expect(inputs[3] === document.activeElement).toBeTruthy();
    });

    it('focuses previoius input after pressing left arrow', () => {
      render({ isFocused: true });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      inputs[2].focus();
      expect(inputs[2] === document.activeElement).toBeTruthy();
      fireEvent.keyDown(inputs[2], {
        key: 'ArrowLeft',
      });
      expect(inputs[1] === document.activeElement).toBeTruthy();
    });
  });

  describe('onFocus', () => {
    it('is called upon clicking input', () => {
      const onFocus = jest.fn();
      render({ onFocus });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      inputs[2].focus();
      expect(onFocus).toHaveBeenCalled();
    });

    it('is called when isFocused prop becomes true while input is unfocused', () => {
      const onFocus = jest.fn();
      const { rerender } = renderElement(
        <TimeInput {...defaultProps} onFocus={onFocus} isFocused={false} />
      );
      expect(onFocus).toHaveBeenCalledTimes(0);

      rerender(
        <TimeInput {...defaultProps} onFocus={onFocus} isFocused={true} />
      );
      expect(onFocus).toHaveBeenCalledTimes(1);
    });
  });

  describe('onBlur', () => {
    it('is called when blurring an input', () => {
      const onBlur = jest.fn();
      render({ onBlur });
      const inputs = screen.getAllByRole('textbox');
      inputs[2].focus();
      inputs[2].blur();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('is called when isFocused prop becomes false while input is focused', () => {
      const onBlur = jest.fn();
      const { rerender } = renderElement(
        <TimeInput {...defaultProps} onBlur={onBlur} isFocused={true} />
      );
      const inputs = screen.getAllByRole('textbox');

      inputs[2].focus();

      rerender(
        <TimeInput {...defaultProps} onBlur={onBlur} isFocused={false} />
      );

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('is NOT called when focus moves between internal inputs', () => {
      const onBlur = jest.fn();
      render({ onBlur });
      const inputs = screen.getAllByRole('textbox');
      act(() => {
        inputs[0].focus();
      });
      act(() => {
        inputs[1].focus();
      });

      expect(onBlur).not.toHaveBeenCalled();
    });
  });

  describe('onChange', () => {
    it('is not called when changed input is not the last', () => {
      const onChange = jest.fn();
      render({ onChange });
      changeInputValue(2, 5);
      expect(onChange).not.toHaveBeenCalledTimes(1);
    });

    it('is called correctly when last input changes', () => {
      const onChange = jest.fn();
      render({ onChange });
      changeInputValue(5, 5);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(6575);
    });

    it('is called correctly when isFocused prop becomes false', () => {
      const onChange = jest.fn();
      const { rerender } = render({ onChange, isFocused: true });
      changeInputValue(2, 5);
      rerender(
        <TimeInput {...defaultProps} isFocused={false} onChange={onChange} />
      );
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(7174);
    });

    it('is not called when isFocused prop becomes false if input was not changed', () => {
      const onChange = jest.fn();
      const { rerender } = render({ onChange, isFocused: true });
      rerender(
        <TimeInput {...defaultProps} isFocused={false} onChange={onChange} />
      );
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('invalid input', () => {
    it('does not move focus to next input', () => {
      const onChange = jest.fn();
      render({ onChange, isFocused: true });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      changeInputValue(2, 9);
      expect(inputs[2] === document.activeElement).toBeTruthy();
    });

    it('does not call onChange', () => {
      const onChange = jest.fn();
      render({ onChange });
      changeInputValue(2, 9);
      enter();
      expect(onChange).not.toHaveBeenCalledTimes(1);
    });

    it('renders invalid value', () => {
      const onChange = jest.fn();
      render({ onChange });
      changeInputValue(2, 9);
      expect(getTime()).toEqual('01:99:34');
    });
  });
});
