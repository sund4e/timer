import TimerApp from './TimerApp';
import { render as renderElement } from '../../tests/render';
import { fireEvent, screen, act } from '@testing-library/react';
import { changeInputValue, enter, focusTimer, getAddButton, getRemoveButton, getStartButton, getTime, getTimes, getToggle, start } from '../../tests/helpers';
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

  it('runs timer after start', () => {
    render({ initialTime: 20 * 60 });
    expect(getTime()).toEqual('00:20:00');
    start();
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');
  });

  it('does not run timer if not started', () => {
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

  it('hides start button when timer is running', () => {
    render({ initialTime: 20 * 60  });
    expect(getTime()).toEqual('00:20:00');
    start();
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
    start();
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
    start();
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
      start();
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

      start();
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');
      expect(getMockAudioInstance().play).toHaveBeenCalledTimes(0);
      advanceSeconds(initialTime);
      expect(getMockAudioInstance().play).toHaveBeenCalledTimes(1);
      expect(getTime()).toEqual('00:00:09');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:08');
    });

    it('false stops timer after finishing', () => {
      const initialTime = 10;
      render({ initialTime });
      expect(getRestartToggle().checked).toBe(false);

      start();
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
        start();
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
          start();
          advanceSeconds(initialTime);

          expect(getMockAudioInstance().play).toHaveBeenCalledTimes(1);
       });
    });
  });

  describe('multiple timers', () => {
    describe('add button', () => {
      it('adds a timer', () => {
        render();
        expect(getTimes()).toEqual(['00:00:00']);
        fireEvent.click(getAddButton());
        expect(getTimes()).toEqual(['00:00:00', '00:00:00']);
      });

      it('adds a timer after focused timer', () => {
        render();
        changeInputValue(4, 1);
        expect(getTimes()).toEqual(['00:00:10']);
        fireEvent.click(getAddButton());
        changeInputValue(10, 2);
        expect(getTimes()).toEqual(['00:00:10', '00:00:20']);
        focusTimer(0);
        fireEvent.click(getAddButton());
        expect(getTimes()).toEqual(['00:00:10', '00:00:00', '00:00:20']);
      });
    });

    describe('remove button', () => {
      it('removes a timer', () => {
        render();
        fireEvent.click(getAddButton());
        expect(getTimes()).toEqual(['00:00:00', '00:00:00']);
        fireEvent.click(getRemoveButton());
        expect(getTimes()).toEqual(['00:00:00']);
      });

      it('removes focused timer', () => {
        render();
        fireEvent.click(getAddButton());
        changeInputValue(4, 1);
        changeInputValue(10, 2);
        expect(getTimes()).toEqual(['00:00:10', '00:00:20']);
        focusTimer(0);
        fireEvent.click(getRemoveButton());
        expect(getTimes()).toEqual(['00:00:20']);
      });
    });
  });

  it('runs timers in sequence', () => {
    render();
    fireEvent.click(getAddButton());
    fireEvent.click(getAddButton());
    changeInputValue(4, 1);
    changeInputValue(10, 1);
    changeInputValue(16, 1);
    expect(getTimes()).toEqual(['00:00:10', '00:00:10', '00:00:10']);
    expect(getMockAudioInstance().play).toHaveBeenCalledTimes(0);

    start();
    advanceSeconds(1);
    expect(getTimes()).toEqual(['00:00:09', '00:00:10', '00:00:10']);
    advanceSeconds(9);
    expect(getTimes()).toEqual(['00:00:10', '00:00:10', '00:00:10']);
    expect(getMockAudioInstance().play).toHaveBeenCalledTimes(1);

    advanceSeconds(1);
    expect(getTimes()).toEqual(['00:00:10', '00:00:09', '00:00:10']);
    advanceSeconds(9);
    expect(getTimes()).toEqual(['00:00:10', '00:00:10', '00:00:10']);
    expect(getMockAudioInstance().play).toHaveBeenCalledTimes(2);

    advanceSeconds(1);
    expect(getTimes()).toEqual(['00:00:10', '00:00:10', '00:00:09']);
    advanceSeconds(9);
    expect(getTimes()).toEqual(['00:00:10', '00:00:10', '00:00:10']);
    expect(getMockAudioInstance().play).toHaveBeenCalledTimes(3);

    advanceSeconds(9);
    expect(getTimes()).toEqual(['00:00:10', '00:00:10', '00:00:10']);
    expect(getMockAudioInstance().play).toHaveBeenCalledTimes(3);
  });

  it('restarts sequence', () => {
    render();
    fireEvent.click(getToggle('Restart timer when done'));
    fireEvent.click(getAddButton());
    fireEvent.click(getAddButton());
    changeInputValue(4, 1);
    changeInputValue(10, 1);
    changeInputValue(16, 1);
    expect(getTimes()).toEqual(['00:00:10', '00:00:10', '00:00:10']);
    expect(getMockAudioInstance().play).toHaveBeenCalledTimes(0);
    start();

    advanceSeconds(11);
    expect(getTimes()).toEqual(['00:00:10', '00:00:09', '00:00:10']);
    expect(getMockAudioInstance().play).toHaveBeenCalledTimes(1);

    advanceSeconds(10);
    expect(getTimes()).toEqual(['00:00:10', '00:00:10', '00:00:09']);
    expect(getMockAudioInstance().play).toHaveBeenCalledTimes(2);

    advanceSeconds(10);
    expect(getTimes()).toEqual(['00:00:09', '00:00:10', '00:00:10']);
    expect(getMockAudioInstance().play).toHaveBeenCalledTimes(3);
  });
});
