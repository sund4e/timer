import TimerApp from './TimerApp';
import { render as renderElement } from '../../tests/render';
import { act, fireEvent, screen } from '@testing-library/react';
import { getTime } from '../../tests/helpers';
import { advanceSeconds, mockTime } from '../../tests/timerMock';
import { Props } from './TimerApp';

const render = (override?: Partial<Props>) => {
  const props = {
    initialTime: 20 * 60,
    isActive: true,
    setTitleTime: () => {},
    ...override,
  };
  return renderElement(<TimerApp {...props} />);
};
describe('TimerApp', () => {
  beforeEach(() => {
    mockTime();
  });
  it('does runs timer if active', () => {
    render({ isActive: true });
    expect(getTime()).toEqual('00:20:00');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');
  });
  it('does not run timer if not active', () => {
    render({ isActive: false });
    expect(getTime()).toEqual('00:20:00');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:20:00');
  });
  it('clicking outside of timer starts the timer', () => {
    const { container } = render();
    expect(getTime()).toEqual('00:20:00');
    const wrapper = container.firstChild as ChildNode;
    fireEvent.click(wrapper);
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');
  });

  it('calls setTitleTime with time', () => {
    const setTitleTime = jest.fn();
    const initialTime = 10;
    render({ isActive: true, setTitleTime, initialTime });
    expect(setTitleTime).toHaveBeenCalledWith(initialTime);
    advanceSeconds(1);
    expect(setTitleTime).toHaveBeenCalledWith(initialTime - 1);
  });
  // Test that enter does not open side menu
  // Test that enter selects timeinput
});
