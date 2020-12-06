import TimerApp from './TimerApp';
import { render as renderElement } from '../../tests/render';
import { fireEvent, screen } from '@testing-library/react';
import { getTime, advanceSeconds } from '../../tests/helpers';
import { Props } from './TimerApp';

jest.useFakeTimers();

const render = (override?: Partial<Props>) => {
  const props = {
    initialTime: 20 * 60,
    isActive: true,
    ...override,
  };
  return renderElement(<TimerApp {...props} />);
};
describe('TimerApp', () => {
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
  it('clicking outside of timer start the timer', () => {
    const { container } = render();
    expect(getTime()).toEqual('00:20:00');
    const wrapper = container.firstChild as ChildNode;
    fireEvent.click(wrapper);
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');
  });
  // Test that enter does not open side menu
  // Test that enter selects timeinput
});
