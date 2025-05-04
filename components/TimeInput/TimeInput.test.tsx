import { fireEvent, screen } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import TimeInput, { Props, getSecondsFromDigits } from './TimeInput';
import { changeInputValue, enter, getTime } from '../../tests/helpers';
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
    rerender(<TimeInput {...defaultProps} value={value + 1} onBlur={jest.fn()} />);
    expect(getTime()).toEqual('01:49:35');
  });

  describe('Focusing', () => {
    it('focuses input on click', () => {
      render();
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const input = inputs[2];
      fireEvent.click(input);
      expect(input === document.activeElement).toBeTruthy();
    });

    it('focuses next input after finishing one', () => {
      render();
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      changeInputValue(0, 1);
      changeInputValue(1, 5);
      expect(inputs[2] === document.activeElement).toBeTruthy();
    });

    it('focuses next input after pressing right arrow', () => {
      render();
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      fireEvent.click(inputs[2]);
      fireEvent.keyDown(inputs[2], {
        key: 'ArrowRight',
      });
      expect(inputs[3] === document.activeElement).toBeTruthy();
    });

    it('focuses previoius input after pressing left arrow', () => {
      render();
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      fireEvent.click(inputs[2]);
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

  describe('onBlur', () => {
    it('is called when blurring an input', () => {
      const onBlur = jest.fn();
      render({ onBlur });
      const inputs = screen.getAllByRole('textbox');
      fireEvent.focus(inputs[2]);
      fireEvent.blur(inputs[2]);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('is called when isFocused prop becomes false while input is focused', () => {
      const onBlur = jest.fn();
      const { rerender } = renderElement(
        <TimeInput {...defaultProps} onBlur={onBlur} isFocused={true} />
      );
      const inputs = screen.getAllByRole('textbox');

      act(() => {
        inputs[2].focus();
      });
      
      rerender(<TimeInput {...defaultProps} onBlur={onBlur} isFocused={false} />);

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('is not called when Enter is pressed while an input is focused', () => {
      const onBlur = jest.fn();
      const onChange = jest.fn();
      
      render({ ...defaultProps, onBlur, onChange, isFocused: true }); 
      
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

      const focusedElement = document.activeElement || inputs[2];
      fireEvent.keyDown(focusedElement, { key: 'Enter', code: 'Enter' });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onBlur).not.toHaveBeenCalled(); 
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

    it('is called correctly on enter', () => {
      const onChange = jest.fn();
      render({ onChange, isFocused: true });
      expect(getTime()).toEqual('01:49:34');
      changeInputValue(4, 5);
      enter();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(getSecondsFromDigits([0, 1, 4, 9, 5, 4]));
    });
  });

  describe('invalid input', () => {
    it('does not move focus to next input', () => {
      const onChange = jest.fn();
      render({ onChange });
      changeInputValue(2, 9);
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
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

    it('does not call onBlur when invalid', () => {
      const onBlur = jest.fn();
      render({ onBlur });
      const inputs = screen.getAllByRole('textbox');
      changeInputValue(2, 9);
      fireEvent.blur(inputs[2]);
      expect(onBlur).toHaveBeenCalledTimes(0);
    });

  });
});
