import { fireEvent, screen, act, getNodeText } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import Timer, { Props } from './Timer';
import { changeInputValue, enter, getTime } from '../../tests/helpers';
import { advanceSeconds, mockTime } from '../../tests/timerMock';
import { simulateWindowBlur, simulateWindowFocus } from '../../tests/helpers';

describe('Timer', () => {
  const render = (override?: Partial<Props>) => {
    const defaultProps = {
      initialTime: 10,
      onTimeEnd: () => {},
      isActive: true,
      restart: false,
      initalFocus: false,
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

  it('if active runs timer when not focused', () => {
    const initialTime = 10;
    render({ initialTime, isActive: true, initialFocus: false });
    expect(getTime()).toEqual('00:00:10');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:00:09');
  });

  it('if not active does not run timer', () => {
    const initialTime = 10;
    render({ initialTime, isActive: false, initialFocus: false });
    expect(getTime()).toEqual('00:00:10');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:00:10');
  });

  it('if focused does not run timer', () => {
    const initialTime = 10;
    render({ initialTime, isActive: true, initialFocus: true });
    expect(getTime()).toEqual('00:00:10');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:00:10');
  });

  describe('onTimeEnd', () => {
    it('is called when timer runs to end', () => {
      const onTimeEnd = jest.fn();
      render({
        initialTime: 3,
        isActive: true,
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
        isActive: true,
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
        isActive: true,
        onTimeEnd,
      });
      expect(onTimeEnd).not.toHaveBeenCalled();
    });
  });

  describe('restart', () => {
    it('true runs timer again after finishing', () => {
      const initialTime = 10;
      render({ initialTime, isActive: true, restart: true });
      expect(getTime()).toEqual('00:00:10');

      act(() => {
        advanceSeconds(initialTime);
      });
      expect(getTime()).toEqual('00:00:10');
    });

    it('false stops timer after finishing', () => {
      const initialTime = 10;
      render({ initialTime, isActive: true, restart: false });
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(initialTime);
      expect(getTime()).toEqual('00:00:00');
    });
  });

  describe('Enter', () => {
    it('starts timer', () => {
      const initialTime = 10;
      render({
        initialTime,
        isActive: true,
        restart: false,
        initialFocus: true,
      });
      enter();
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');
    });

    it('continues timer from the same value if no change in the value', () => {
      const initialTime = 10;
      render({ initialTime, isActive: true, initialFocus: false });
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
      render({ initialTime, isActive: true, initialFocus: false, restart: true });
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
      const { rerender } = render({
        initialTime,
        isActive: true,
        initialFocus: false,
      });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

      changeInputValue(4, 2);

      advanceSeconds(1);

      expect(getTime()).toEqual('00:00:20');
    });

    it('starts timer if edited number was the last', () => {
      const initialTime = 0;
      render({ initialTime, isActive: true });
      changeInputValue(5, 2);
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:01');
    });

    it('changes time to new one', () => {
      const initialTime = 10;
      render({ initialTime, isActive: true });
      changeInputValue(5, 2);
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:11');
    });

    it('does not start timer if edited number was not valid', () => {
      const initialTime = 0;
      render({ initialTime, isActive: true });
      changeInputValue(2, 9);
      enter();
      expect(getTime()).toEqual('00:90:00');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:90:00');
    });
  });

  describe('Window Focus Handling', () => {
    it('should pause timer if input was focused when window focus is lost', () => {
      const initialTime = 60;
      render({ initialTime, isActive: true });

      const inputElements = screen.getAllByRole('textbox');
      const lastInputElement = inputElements[inputElements.length - 1];

      advanceSeconds(2);
      expect(getTime()).toEqual('00:00:58');

      act(() => {
        fireEvent.focus(lastInputElement);
      });
      advanceSeconds(5);
      expect(getTime()).toEqual('00:00:58');

      simulateWindowBlur();

      advanceSeconds(5);
      expect(getTime()).toEqual('00:00:58');

      simulateWindowFocus();
      advanceSeconds(5);
      expect(getTime()).toEqual('00:00:58');

      act(() => {
        fireEvent.blur(lastInputElement);
      });
      advanceSeconds(3);
      expect(getTime()).toEqual('00:00:55');
    });

    it('should continue timer if input was not focused when window focus is lost', () => {
      const initialTime = 60;
      render({ initialTime, isActive: true });

      advanceSeconds(3);
      expect(getTime()).toEqual('00:00:57');

      simulateWindowBlur();

      advanceSeconds(10);
      expect(getTime()).toEqual('00:00:47');

      simulateWindowFocus();
      advanceSeconds(4);
      expect(getTime()).toEqual('00:00:43');
    });
  });
});
