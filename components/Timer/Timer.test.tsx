import { fireEvent, screen, act, getNodeText } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import Timer, { Props } from './Timer';
import { getElementWithText } from '../../tests/helpers';

jest.useFakeTimers();

fdescribe('Timer', () => {
  const render = (override?: Partial<Props>) => {
    const defaultProps = {
      initialTime: 10,
      onTimeEnd: () => {},
      isActive: true,
      isFocused: true,
      setIsFocused: () => {},
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
    render({ initialTime, isActive: true, isFocused: false });
    expect(getElementWithText('00:00:10')).toBeDefined();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getElementWithText('00:00:09')).toBeDefined();
  });

  it('if not active does not run timer', () => {
    const initialTime = 10;
    render({ initialTime, isActive: false, isFocused: false });
    expect(getElementWithText('00:00:10')).toBeDefined();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getElementWithText('00:00:10')).toBeDefined();
  });

  it('if focused does not run timer', () => {
    const initialTime = 10;
    render({ initialTime, isActive: true, isFocused: true });
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
      isFocused: false,
      onTimeEnd,
    });
    expect(getElementWithText('00:00:03')).toBeDefined();
    act(() => {
      jest.runAllTimers();
    });
    expect(onTimeEnd).toHaveBeenCalledTimes(1);
  });

  it('runs timer after value input even if new value is the same as inital', () => {
    const initialTime = 10;
    render({ initialTime, isActive: true, isFocused: true });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const lastInput = inputs[inputs.length - 1];
    fireEvent.click(lastInput);
    fireEvent.keyPress(lastInput, {
      key: '0',
      charCode: 49,
    });
    expect(getElementWithText('00:00:10')).toBeDefined();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getElementWithText('00:00:09')).toBeDefined();
  });
});
