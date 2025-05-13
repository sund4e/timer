import { screen, fireEvent, act, within } from '@testing-library/react';

const formatTime = (numbers: string[]): string => {
  return `${numbers.slice(0, 2).join('')}:${numbers.slice(2, 4).join('')}:${numbers.slice(4, 6).join('')}`;
};

const getTimerTime = (timer: HTMLElement) => {
  const { getAllByRole } = within(timer);
  const numbers = getAllByRole('textbox').map((input) => (input as HTMLInputElement).value);
  return formatTime(numbers);
}

const getTimers = () => {
  return screen.getAllByTestId('time');
}

export const getTime = (): string | null => {
  const timers = getTimers();
  const activeTimer = timers.find(timer => timer.classList.contains('active'));
  if (!activeTimer) return null;
  return getTimerTime(activeTimer);
};

export const getTimes = (): string[] => {
  const timers = getTimers();  
  return timers.map(timer => getTimerTime(timer));
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

export const getStartButton = () => {
  return screen.getByTestId('start-button');
};

export const getAddButton = () => {
  return screen.getByTestId('add-button');
};

export const getRemoveButton = () => {
  return screen.getByTestId('remove-button');
};

export const start = () => {
  act(() => {
    getStartButton().click();
  });
}

export const getToggle = (text: string) => {
  const soundLabel = screen.getByText(text);
  const toggleInput = soundLabel.parentElement?.querySelector('input[type="checkbox"], input[role="switch"]') || screen.getByRole('switch', { name: /sound/i });
  if (!toggleInput) throw new Error(`Could not find ${text} toggle input`);
  return toggleInput as HTMLInputElement;
}
