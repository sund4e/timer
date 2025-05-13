import TimerApp from './TimerApp';
import { render as renderElement } from '../../tests/render';
import { fireEvent, screen, act } from '@testing-library/react';
import { changeInputValue, enter, getAddButton, getStartButton, getTime, getToggle } from '../../tests/helpers';
import { advanceSeconds, mockTime } from '../../tests/timerMock';
import { Props } from './TimerApp';
import { setupAudioMock, restoreAudioMock, getMockAudioInstance } from '../../tests/audioMock';

// --- Mocks ---

const originalUserAgent = navigator.userAgent;

// Helper to set user agent for tests
const setDeviceUserAgent = (isMobile: boolean) => {
  const ua = isMobile
    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
    : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';
  Object.defineProperty(window.navigator, 'userAgent', {
    value: ua,
    writable: true,
    configurable: true,
  });
};

const render = (override?: Partial<Props>) => {
  const props = {
    initialTime: 0,
    isActive: true,
    setTitleTime: () => {},
    ...override,
  };
  return renderElement(<TimerApp {...props} />);
};

describe('timerApp', () => {
  beforeEach(() => {
    setupAudioMock();
    mockTime();
  });

  afterEach(() => {
    jest.useRealTimers();
    restoreAudioMock();
    Object.defineProperty(window.navigator, 'userAgent', {
        value: originalUserAgent,
        writable: true,
        configurable: true
    });
  });

  it('does run timer if active', () => {
    render({ initialTime: 20 * 60 });
    expect(getTime()).toEqual('00:20:00');
    enter();
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');
  });

  it('does not run timer if not active', () => {
    render({ initialTime: 20 * 60  });
    expect(getTime()).toEqual('00:20:00');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:20:00');
  });

  it('starts timer after clicking start button', () => {
    render({ initialTime: 20 * 60  });
    expect(getTime()).toEqual('00:20:00');
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');
  });

  it('shows start button only when timer is not running', () => {
    render({ initialTime: 20 * 60  });
    expect(getTime()).toEqual('00:20:00');
    enter();
    const startButton = getStartButton();
    expect(window.getComputedStyle(startButton).opacity).toBe('0');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.focus(inputs[2]);
    expect(window.getComputedStyle(startButton).opacity).toBe('1');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');

    fireEvent.click(startButton);
    expect(window.getComputedStyle(startButton).opacity).toBe('0');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:58');
  });

  it('clicking outside of timer does not start the timer', () => {
    render({ initialTime: 20 * 60 });
    expect(getTime()).toEqual('00:20:00');
    enter();
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.focus(inputs[2]);
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');

    fireEvent.blur(inputs[2]);
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');
  });

  it('calls setTitleTime with time', () => {
    const setTitleTime = jest.fn();
    const initialTime = 10;
    render({ setTitleTime, initialTime });
    enter();
    expect(setTitleTime).toHaveBeenCalledWith(initialTime);
    advanceSeconds(1);
    expect(setTitleTime).toHaveBeenCalledWith(initialTime - 1);
  });

  describe('initial render', () => {
    it('does not focus time input if initial time is 0', () => {
      render();
      expect(document.activeElement).toBe(document.body);
    });

    it('shows buttons if initial time is 0', () => {
      render();
      expect(screen.getByTestId('start-button')).toBeTruthy();
      expect(screen.getByTestId('add-button')).toBeTruthy();
      expect(screen.getByTestId('remove-button')).toBeTruthy();
    });
  });

  describe('enter', () => {
    it('focuses time input if not focused', () => {
      render();
      expect(document.activeElement).toBe(document.body);
      enter();
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      expect(document.activeElement).toBe(inputs[0]);
    });

    it('unfocuses time input if focused', () => {
      render();
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      act(() => {
        inputs[0].focus();
      });
      expect(document.activeElement).toBe(inputs[0]);

      enter();
      expect(document.activeElement).toBe(document.body);
    });

    it('stops timer if running', () => {
      render({ initialTime: 10 });
      expect(getTime()).toEqual('00:00:10');
      enter();
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');

      enter();
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');
    });

    it('starts timer if not running', () => {
      render({ initialTime: 10});
      expect(getTime()).toEqual('00:00:10');
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      fireEvent.focus(inputs[2]);
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:10');

      enter();
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');
    });
  });

  describe('changing time', () => {
    it('starts time from new time after pressing start button', () => {
      render();
      expect(getTime()).toEqual('00:00:00');
      changeInputValue(4, 5);
      expect(getTime()).toEqual('00:00:50');
      const startButton = getStartButton();
      fireEvent.click(startButton);
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:49');
    });
    
    it('starts time from new time after pressing enter', () => {
      render();
      expect(getTime()).toEqual('00:00:00');
      changeInputValue(4, 5);
      expect(getTime()).toEqual('00:00:50');
      enter();
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:49');
    });
  });

  describe('restart', () => {
    const getRestartToggle = () => {
      return getToggle('Restart timer when done');
    }

    it('true runs timer again after finishing', () => {
      const initialTime = 10;
      render({ initialTime });
      fireEvent.click(getRestartToggle());
      expect(getRestartToggle().checked).toBe(true);

      enter();
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');
      advanceSeconds(initialTime);
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');
    });

    it('false stops timer after finishing', () => {
      const initialTime = 10;
      render({ initialTime });
      expect(getRestartToggle().checked).toBe(false);

      enter();
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');
      advanceSeconds(initialTime);
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:10');
    });
  });

  describe('sound functionality', () => {
    // Helper to get the Sound Toggle input element
    const getSoundToggle = () => {
      return getToggle('Sound');
    }

    describe('on desktop', () => {
      beforeEach(() => {
        setDeviceUserAgent(false);
      });

      test('should default sound toggle to on', () => {
        render();
        expect(getSoundToggle().checked).toBe(true);
      });

      test('should play sound when timer ends if toggle is on', () => {
        const initialTime = 3;
        render({ initialTime });
        expect(getSoundToggle().checked).toBe(true);
        enter();
        advanceSeconds(initialTime);
        
        expect(getMockAudioInstance().play).toHaveBeenCalledTimes(1);
      });

      test('should not play sound when timer ends if toggle is off', () => {
        const initialTime = 3;
        render({ initialTime });

        act(() => {
          fireEvent.click(getSoundToggle());
        });
        expect(getSoundToggle().checked).toBe(false);
        getMockAudioInstance().play.mockClear();

        advanceSeconds(initialTime);

        expect(getMockAudioInstance().play).not.toHaveBeenCalled();
      });
    });

    describe('on mobile', () => {
      beforeEach(() => {
        setDeviceUserAgent(true);
      });

      test('should default sound toggle to off', () => {
        render();
        expect(getSoundToggle().checked).toBe(false);
      });

      test('should not play sound when timer ends if toggle is off', () => {
         const initialTime = 3;
         render({ initialTime });
         expect(getSoundToggle().checked).toBe(false);

         advanceSeconds(initialTime);

         expect(getMockAudioInstance().play).not.toHaveBeenCalled();
      });

      test('should attempt to play sound immediately when toggle is turned on', () => {
        render();
        expect(getMockAudioInstance().play).not.toHaveBeenCalled();

        act(() => {
          fireEvent.click(getSoundToggle());
        });
        expect(getSoundToggle().checked).toBe(true);

        expect(getMockAudioInstance().play).toHaveBeenCalledTimes(1);
      });

       test('should play sound when timer ends after toggle has been turned on', () => {
          const initialTime = 3;
          render({ initialTime });

         act(() => {
           fireEvent.click(getSoundToggle());
         });
          expect(getSoundToggle().checked).toBe(true);

          getMockAudioInstance().play.mockClear();
          enter();
          advanceSeconds(initialTime);

          expect(getMockAudioInstance().play).toHaveBeenCalledTimes(1);
       });
    });
  });

  describe('multiple timers', () => {
    it('add button adds a timer', () => {
      render();
      fireEvent.click(getAddButton());
      expect(getTime()).toEqual('00:00:10');
    });
  });
});
