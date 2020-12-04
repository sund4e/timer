import TimerApp from './TimerApp';
import { render as renderElement } from '../../tests/render';
import { fireEvent, screen } from '@testing-library/react';
import { getTime, advanceSeconds } from '../../tests/helpers';

jest.useFakeTimers();

const render = () => {
  return renderElement(<TimerApp />);
};
describe('TimerApp', () => {
  it('does not run timer by default', () => {
    const { container } = render();
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
