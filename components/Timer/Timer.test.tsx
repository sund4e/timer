import { screen } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import Timer, { Props } from './Timer';
import { changeInputValue, enter, getTime } from '../../tests/helpers';
import { advanceSeconds, mockTime } from '../../tests/timerMock';

describe('Timer', () => {
  const render = (override?: Partial<Props>) => {
    const defaultProps = {
      initialTime: 10,
      onTimeEnd: () => {},
      isRunning: true,
      restart: false,
      isFocused: false,
      setTitleTime: () => {},
      ...override,
    };
    const rendered = renderElement(<Timer {...defaultProps} />);
    return {
      ...rendered,
      rerender: (props?: Partial<Props>) =>
        rendered.rerender(<Timer {...defaultProps} {...props} />),
    };
  };

  beforeEach(() => {
    mockTime();
  });

  it('renders intial time', () => {
    const initialTime = 10;
    render({ initialTime });
    expect(getTime()).toEqual('00:00:10');
  });

  it('if isRunning = true runs timer when not focused', () => {
    const initialTime = 10;
    render({ initialTime, isRunning: true });
    expect(getTime()).toEqual('00:00:10');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:00:09');
  });

  it('if isRunning = false does not run timer', () => {
    const initialTime = 10;
    render({ initialTime, isRunning: false });
    expect(getTime()).toEqual('00:00:10');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:00:10');
  });

  describe('onTimeEnd', () => {
    it('is called when timer runs to end', () => {
      const onTimeEnd = jest.fn();
      render({
        initialTime: 3,
        isRunning: true,
        onTimeEnd,
      });
      expect(getTime()).toEqual('00:00:03');
      advanceSeconds(3);
      expect(onTimeEnd).toHaveBeenCalledTimes(1);
    });

    it('is called even if timer is over time', () => {
      const onTimeEnd = jest.fn();
      render({
        initialTime: 3,
        isRunning: true,
        onTimeEnd,
      });
      expect(getTime()).toEqual('00:00:03');
      advanceSeconds(9);
      expect(onTimeEnd).toHaveBeenCalledTimes(1);
    });

    it('is not called if initial time is 0', () => {
      const onTimeEnd = jest.fn();
      render({
        initialTime: 0,
        isRunning: true,
        onTimeEnd,
      });
      expect(onTimeEnd).not.toHaveBeenCalled();
    });
  });

  describe('Enter', () => {
    it('starts timer', () => {
      const initialTime = 10;
      render({
        initialTime,
      });
      enter();
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');
    });

    it('continues timer from the same value if no change in the value', () => {
      const initialTime = 10;
      render({ initialTime });
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');

      changeInputValue(2, 0);
      enter();

      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:08');
    });

    it('keeps the original restart value if no change in the value', () => {
      const initialTime = 10;
      render({ initialTime });
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');

      changeInputValue(2, 0);
      enter();

      advanceSeconds(10);
      expect(getTime()).toEqual('00:00:10');
    });
  });

  describe('Editing time', () => {
    it('does not start timer if edited number was not the last', () => {
      const initialTime = 0;
      render({
        initialTime,
      });
      screen.getAllByRole('textbox') as HTMLInputElement[];

      changeInputValue(4, 2);

      advanceSeconds(1);

      expect(getTime()).toEqual('00:00:20');
    });

    it('changes time to new one', () => {
      const initialTime = 10;
      render({ initialTime });
      changeInputValue(5, 2);
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:11');
    });

    it('starts timer with new time', () => {
      const initialTime = 10;
      const { rerender } = render({ initialTime, isFocused: true });
      enter();
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');
      changeInputValue(4, 2);
      expect(getTime()).toEqual('00:00:29');
      rerender({ isFocused: false });
      expect(getTime()).toEqual('00:00:29');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:28');
    });

    it('does not start timer if edited number was not valid', () => {
      const initialTime = 0;
      render({ initialTime });
      changeInputValue(2, 9);
      enter();
      expect(getTime()).toEqual('00:90:00');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:90:00');
    });
  });
});
