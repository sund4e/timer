import { fireEvent, screen, act, getNodeText } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import Timer, { Props } from './Timer';
import { changeInputValue, enter, getTime } from '../../tests/helpers';
import { advanceSeconds, mockTime } from '../../tests/timerMock';

describe('Timer', () => {
  const render = (override?: Partial<Props>) => {
    const defaultProps = {
      initialTime: 10,
      onTimeEnd: () => {},
      isActive: true,
      restart: false,
      isFocused: false,
      setIsFocused: () => {},
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
    render({ initialTime, isActive: true, isFocused: false });
    expect(getTime()).toEqual('00:00:10');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:00:09');
  });

  it('if not active does not run timer', () => {
    const initialTime = 10;
    render({ initialTime, isActive: false, isFocused: false });
    expect(getTime()).toEqual('00:00:10');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:00:10');
  });

  it('if focused does not run timer', () => {
    const initialTime = 10;
    render({ initialTime, isActive: true, isFocused: true });
    expect(getTime()).toEqual('00:00:10');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:00:10');
  });

  it('calls onTimeEnd', () => {
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

  describe('restart', () => {
    it('true runs timer again after finishing', () => {
      const initialTime = 10;
      render({ initialTime, isActive: true, restart: true });
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(initialTime + 1);
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
        isFocused: false,
      });
      enter();
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');
    });

    it('continues timer from the same value if no change in the value', () => {
      const initialTime = 10;
      render({ initialTime, isActive: true });
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');

      changeInputValue(2, 0);
      enter();

      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:08');
    });
  });

  describe('Editing time', () => {
    it('does not start timer if edited number was not the last', () => {
      const initialTime = 0;
      render({ initialTime, isActive: true });
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
  });
});
