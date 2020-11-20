import { fireEvent, screen, act, getNodeText } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import Timer, { Props } from './Timer';
import {
  getElementWithText,
  changeInputValue,
  enter,
} from '../../tests/helpers';

jest.useFakeTimers();

fdescribe('Timer', () => {
  const render = (override?: Partial<Props>) => {
    const defaultProps = {
      initialTime: 10,
      onTimeEnd: () => {},
      isActive: true,
      restart: false,
      initialIsFocused: false,
      ...override,
    };
    const rendered = renderElement(<Timer {...defaultProps} />);
    return {
      ...rendered,
      rerender: (props?: Partial<Props>) =>
        rendered.rerender(<Timer {...defaultProps} {...props} />),
    };
  };

  it('renders intial time', () => {
    const initialTime = 10;
    render({ initialTime });
    expect(getElementWithText('00:00:10')).toBeDefined();
  });
  it('if active runs timer when not focused', () => {
    const initialTime = 10;
    render({ initialTime, isActive: true, initialIsFocused: false });
    expect(getElementWithText('00:00:10')).toBeDefined();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getElementWithText('00:00:09')).toBeDefined();
  });

  it('if not active does not run timer', () => {
    const initialTime = 10;
    render({ initialTime, isActive: false, initialIsFocused: false });
    expect(getElementWithText('00:00:10')).toBeDefined();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getElementWithText('00:00:10')).toBeDefined();
  });

  it('if focused does not run timer', () => {
    const initialTime = 10;
    render({ initialTime, isActive: true, initialIsFocused: true });
    expect(getElementWithText('00:00:10')).toBeDefined();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getElementWithText('00:00:10')).toBeDefined();
  });

  it('calls onTimeEnd', () => {
    const onTimeEnd = jest.fn();
    const { rerender } = render({
      initialTime: 3,
      isActive: true,
      onTimeEnd,
    });
    expect(getElementWithText('00:00:03')).toBeDefined();
    act(() => {
      jest.runAllTimers();
    });
    expect(onTimeEnd).toHaveBeenCalledTimes(1);
  });

  describe('restart', () => {
    it('true runs timer again after finishing', () => {
      const initialTime = 10;
      render({ initialTime, isActive: true, restart: true });
      expect(getElementWithText('00:00:10')).toBeDefined();
      act(() => {
        jest.advanceTimersByTime(10000);
      });
      expect(getElementWithText('00:00:10')).toBeDefined();
    });

    it('false stops timer after finishing', () => {
      const initialTime = 10;
      render({ initialTime, isActive: true, restart: false });
      expect(getElementWithText('00:00:10')).toBeDefined();
      act(() => {
        jest.advanceTimersByTime(10000);
      });
      expect(getElementWithText('00:00:00')).toBeDefined();
    });
  });

  describe('Enter', () => {
    it('starts timer', () => {
      const initialTime = 10;
      render({
        initialTime,
        isActive: true,
        restart: false,
        initialIsFocused: true,
      });
      enter();
      expect(getElementWithText('00:00:10')).toBeDefined();
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(getElementWithText('00:00:09')).toBeDefined();
    });

    it('continues timer from the same value if no change in the value', () => {
      const initialTime = 10;
      render({ initialTime, isActive: true });
      expect(getElementWithText('00:00:10')).toBeDefined();
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(getElementWithText('00:00:09')).toBeDefined();

      changeInputValue(2, 0);
      enter();

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(getElementWithText('00:00:08')).toBeDefined();
    });
  });
});
