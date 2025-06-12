import { screen, fireEvent, act, within } from '@testing-library/react';

const formatTime = (numbers: string[]): string => {
  return `${numbers.slice(0, 2).join('')}:${numbers.slice(2, 4).join('')}:${numbers.slice(4, 6).join('')}`;
};

const getTimerTime = (timer: HTMLElement) => {
  const { getAllByRole } = within(timer);
  const numbers = getAllByRole('textbox').map(
    (input) => (input as HTMLInputElement).value
  );
  return formatTime(numbers);
};

export const getTimers = () => {
  return screen.getAllByTestId('time');
};

export const getActiveTimer = () => {
  const activeTimer = screen.getByTestId('active-list-item').children[0];
  if (!activeTimer) throw new Error('No active timer found');
  return activeTimer as HTMLElement;
};

export const getTime = (): string | null => {
  return getTimerTime(getActiveTimer());
};

export const getTimes = (): string[] => {
  const timers = getTimers();
  return timers.map((timer) => getTimerTime(timer));
};

export const changeInputValue = (inputInxed: number, value: number) => {
  const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
  const input = inputs[inputInxed];
  act(() => {
    input.focus();
    fireEvent.change(input, { target: { value } });
  });
};

export const enter = () => {
  fireEvent.keyDown(document.activeElement as HTMLElement, {
    key: 'Enter',
    charCode: 13,
  });
};

export const simulateWindowBlur = () => {
  act(() => {
    window.dispatchEvent(new window.FocusEvent('blur'));
  });
};

export const simulateWindowFocus = () => {
  act(() => {
    window.dispatchEvent(new window.FocusEvent('focus'));
  });
};

export const getButton = (buttonId: string) => {
  const button = screen.queryByTestId(`${buttonId}-button`);
  // Ensure button is visible
  if (
    !button ||
    window.getComputedStyle(button?.parentElement as Element).opacity === '0'
  ) {
    return null;
  }
  return button;
};

export const clickButton = (buttonId: string) => {
  const button = getButton(buttonId);
  if (!button) throw new Error(`Could not find ${buttonId} button`);
  act(() => {
    button.focus();
    button.click();
  });
};

export const getToggle = (text: string) => {
  const soundLabel = screen.getByText(text);
  const toggleInput =
    soundLabel.parentElement?.querySelector(
      'input[type="checkbox"], input[role="switch"]'
    ) || screen.getByRole('switch', { name: /sound/i });
  if (!toggleInput) throw new Error(`Could not find ${text} toggle input`);
  return toggleInput as HTMLInputElement;
};

export const focusTimer = (index: number) => {
  const timers = getTimers();
  const timer = timers[index];
  if (!timer) throw new Error('No timer found');
  act(() => {
    timer.focus();
  });
};
