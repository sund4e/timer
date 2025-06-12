import TimerApp from './TimerApp';
import { render as renderElement } from '../../tests/render';
import { fireEvent, screen, act } from '@testing-library/react';
import {
  changeInputValue,
  clickButton,
  enter,
  focusTimer,
  getActiveTimer,
  getButton,
  getTime,
  getTimers,
  getTimes,
  getToggle,
} from '../../tests/helpers';
import { advanceSeconds, mockTime } from '../../tests/timerMock';
import { Props } from './TimerApp';
import {
  setupAudioMock,
  restoreAudioMock,
  getMockAudioInstance,
} from '../../tests/audioMock';
import {
  mockIntersectionObserver,
  restoreIntersectionObserver,
} from '../../tests/interserctionObserverMock';

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
    mockIntersectionObserver();
    localStorage.clear();
    Element.prototype.scrollIntoView = jest.fn();
    global.ResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
    restoreAudioMock();
    restoreIntersectionObserver();
    Object.defineProperty(window.navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
  });

  it('runs timer after start', () => {
    render({ initialTime: 20 * 60 });
    expect(getTime()).toEqual('00:20:00');
    clickButton('start');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');
  });

  it('does not run timer if not started', () => {
    render({ initialTime: 20 * 60 });
    expect(getTime()).toEqual('00:20:00');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:20:00');
  });

  it('starts timer after clicking start button', () => {
    render({ initialTime: 20 * 60 });
    expect(getTime()).toEqual('00:20:00');
    clickButton('start');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');
  });

  it('hides start button when timer is running', () => {
    render({ initialTime: 20 * 60 });
    expect(getTime()).toEqual('00:20:00');
    expect(getButton('start')).toBeTruthy();

    clickButton('start');
    expect(getButton('start')).toBeNull();
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.focus(inputs[2]);
    expect(getButton('start')).toBeNull();
    expect(getButton('resume')).toBeTruthy();

    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');

    clickButton('resume');
    expect(getButton('resume')).toBeNull();
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:58');
  });

  it('clicking outside of timer does not start the timer', () => {
    render({ initialTime: 20 * 60 });
    expect(getTime()).toEqual('00:20:00');
    clickButton('start');
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
    clickButton('start');
    expect(setTitleTime).toHaveBeenCalledWith(initialTime);
    advanceSeconds(1);
    expect(setTitleTime).toHaveBeenCalledWith(initialTime - 1);
  });

  it('stops the timer sequence when the wrapper is clicked while running', () => {
    render({ initialTime: 60 });
    expect(getTime()).toEqual('00:01:00');

    clickButton('start');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:00:59');
    expect(getButton('start')).toBeNull();

    const timerSetWrapper = screen.getByTestId('timer-set-wrapper');
    act(() => {
      fireEvent.click(timerSetWrapper);
    });

    const resumeButton = getButton('resume');
    expect(resumeButton).not.toBeNull();
    expect(document.activeElement).toBe(resumeButton);

    // Time should not advance further
    const currentTime = getTime();
    advanceSeconds(1);
    expect(getTime()).toEqual(currentTime);
  });

  describe('localStorage', () => {
    it('loads and displays timers from localStorage if present', () => {
      const savedTimers = [
        { id: 'timer1', initialTime: 60 * 5 },
        { id: 'timer2', initialTime: 60 * 10 },
      ];
      localStorage.setItem('timers', JSON.stringify(savedTimers));
      render({ initialTime: 20 * 60 });
      const displayedTimes = getTimes();
      expect(displayedTimes).toEqual(['00:05:00', '00:10:00']);
    });

    it('saves timers to localStorage when they are changed', () => {
      render({});
      focusTimer(0);
      clickButton('add');
      changeInputValue(3, 5);
      changeInputValue(8, 1);
      enter();
      expect(getTimes()).toEqual(['00:05:00', '00:10:00']);

      const savedDataString = localStorage.getItem('timers');
      expect(savedDataString).not.toBeNull();
      const savedData = JSON.parse(savedDataString!);

      expect(savedData).toHaveLength(2);
      expect(savedData[0].initialTime).toBe(60 * 5);
      expect(savedData[1].initialTime).toBe(60 * 10);
    });
  });

  describe('buttons', () => {
    it('inital render shows and focuses start button', () => {
      render();
      expect(getButton('start')).toBeTruthy();
      expect(document.activeElement).toBe(getButton('start'));
    });

    it('inital render shows correct buttons', () => {
      render();
      expect(getButton('start')).toBeTruthy();
      expect(getButton('add')).toBeTruthy();
      expect(getButton('remove')).toBeFalsy();
      expect(getButton('reset')).toBeFalsy();
      expect(getButton('restart')).toBeFalsy();
    });

    it('does not show buttons if timer is running', () => {
      render();
      clickButton('start');
      expect(getButton('start')).toBeFalsy();
      expect(getButton('add')).toBeFalsy();
      expect(getButton('remove')).toBeFalsy();
      expect(getButton('reset')).toBeFalsy();
      expect(getButton('restart')).toBeFalsy();
    });

    it('shows resume and reset buttons if timer focused after start', () => {
      render();
      clickButton('start');
      focusTimer(0);
      expect(getButton('start')).toBeFalsy();
      expect(getButton('resume')).toBeTruthy();
      expect(getButton('reset')).toBeTruthy();
    });

    it('shows start button again if focused timer edited', () => {
      render();
      clickButton('start');
      focusTimer(0);
      changeInputValue(1, 1);
      expect(getButton('start')).toBeTruthy();
      expect(getButton('resume')).toBeFalsy();
      expect(getButton('reset')).toBeFalsy();
    });

    it('shows add and remove buttons correctly if timer focused', () => {
      render();
      clickButton('start');
      focusTimer(0);
      expect(getButton('add')).toBeTruthy();
      expect(getButton('remove')).toBeFalsy();

      fireEvent.click(getButton('add') as HTMLButtonElement);
      expect(getButton('remove')).toBeTruthy();
    });

    it('shows add button even after editing timer', () => {
      render();
      focusTimer(0);
      expect(getButton('add')).toBeTruthy();
      changeInputValue(1, 1);
      act(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
      expect(getButton('add')).toBeTruthy();
    });

    it('shows start button after timer done if restart is false', () => {
      render({ initialTime: 10 });
      clickButton('start');
      expect(getButton('start')).toBeFalsy();
      advanceSeconds(10);
      expect(getTime()).toEqual('00:00:10');
      expect(getButton('start')).toBeTruthy();
      expect(document.activeElement).toBe(getButton('start'));
    });

    describe('resume button', () => {
      it('continues timer', () => {
        render({ initialTime: 20 * 60 });
        clickButton('start');
        advanceSeconds(1);
        expect(getTime()).toEqual('00:19:59');

        focusTimer(0);
        advanceSeconds(1);
        expect(getTime()).toEqual('00:19:59');

        clickButton('resume');
        advanceSeconds(1);
        expect(getTime()).toEqual('00:19:58');
      });
    });

    describe('reset button', () => {
      it('resets timer', () => {
        render({ initialTime: 20 * 60 });
        expect(getTime()).toEqual('00:20:00');
        clickButton('start');
        advanceSeconds(1);
        expect(getTime()).toEqual('00:19:59');

        focusTimer(0);
        advanceSeconds(1);
        expect(getTime()).toEqual('00:19:59');

        clickButton('reset');
        expect(getTime()).toEqual('00:20:00');

        const startButton = getButton('start');
        expect(startButton).not.toBeNull();
        expect(document.activeElement).toBe(startButton);

        clickButton('start');
        advanceSeconds(1);
        expect(getTime()).toEqual('00:19:59');
      });
    });
  });

  describe('enter', () => {
    it('focuses resume button if focused', () => {
      render();
      clickButton('start');
      expect(document.activeElement).toBe(document.body);
      enter();
      expect(document.activeElement).toBe(getButton('resume'));
    });

    it('focuses and triggers start and resume buttons correctly', () => {
      render({ initialTime: 10 });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      act(() => {
        inputs[0].focus();
      });
      expect(document.activeElement).toBe(inputs[0]);

      enter();
      expect(document.activeElement).toBe(getButton('start'));

      enter();
      expect(getTime()).toEqual('00:00:10');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');

      enter();
      expect(document.activeElement).toBe(getButton('resume'));
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');

      enter();
      expect(document.activeElement).toBe(document.body);
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:08');
    });

    it('stops timer if running', () => {
      render({ initialTime: 10 });
      expect(getTime()).toEqual('00:00:10');
      clickButton('start');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');

      enter();
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:09');
    });

    it('focuses start button if not running and triggers start', () => {
      render({ initialTime: 10 });
      expect(getTime()).toEqual('00:00:10');
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      fireEvent.focus(inputs[2]);
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:10');

      enter();
      expect(document.activeElement).toBe(getButton('start'));
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:10');

      enter();
      expect(document.activeElement).toBe(document.body);
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
      clickButton('start');
      advanceSeconds(1);
      expect(getTime()).toEqual('00:00:49');
    });
  });

  describe('restart', () => {
    const getRestartToggle = () => {
      return getToggle('Restart timer when done');
    };

    it('true runs timer again after finishing', () => {
      const initialTime = 10;
      render({ initialTime });
      fireEvent.click(getRestartToggle());
      expect(getRestartToggle().checked).toBe(true);

      clickButton('start');
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

      clickButton('start');
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
    };

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
        clickButton('start');
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
        clickButton('start');
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
        focusTimer(0);
        clickButton('add');
        expect(getTimes()).toEqual(['00:00:00', '00:00:00']);
      });

      it('adds a timer after focused timer', () => {
        render();
        changeInputValue(4, 1);
        expect(getTimes()).toEqual(['00:00:10']);
        focusTimer(0);
        clickButton('add');
        changeInputValue(10, 2);
        expect(getTimes()).toEqual(['00:00:10', '00:00:20']);
        focusTimer(0);
        clickButton('add');
        expect(getTimes()).toEqual(['00:00:10', '00:00:00', '00:00:20']);
      });
    });

    describe('remove button', () => {
      beforeEach(() => {
        render();
        focusTimer(0);
        clickButton('add');
      });

      it('removes a timer', () => {
        expect(getTimes()).toEqual(['00:00:00', '00:00:00']);
        clickButton('remove');
        expect(getTimes()).toEqual(['00:00:00']);
      });

      it('removes focused timer', () => {
        changeInputValue(4, 1);
        changeInputValue(10, 2);
        expect(getTimes()).toEqual(['00:00:10', '00:00:20']);
        focusTimer(0);
        clickButton('remove');
        expect(getTimes()).toEqual(['00:00:20']);
      });
    });

    describe('reset button', () => {
      beforeEach(() => {
        render();
        focusTimer(0);
        clickButton('add');
        changeInputValue(4, 1);
        changeInputValue(10, 2);
      });

      it('resets all timers', () => {
        expect(getTimes()).toEqual(['00:00:10', '00:00:20']);
        clickButton('start');
        advanceSeconds(15);
        expect(getTimes()).toEqual(['00:00:10', '00:00:15']);
        focusTimer(0);
        clickButton('reset');
        expect(getTimes()).toEqual(['00:00:10', '00:00:20']);
      });

      it('moves focus to first timer', () => {
        clickButton('start');
        advanceSeconds(15);
        expect(getTimes()).toEqual(['00:00:10', '00:00:15']);
        focusTimer(0);
        clickButton('reset');
        expect(getActiveTimer()).toEqual(getTimers()[0]);
      });
    });
  });

  it('runs timers in sequence', () => {
    render();
    focusTimer(0);
    clickButton('add');
    clickButton('add');
    changeInputValue(4, 1);
    changeInputValue(10, 1);
    changeInputValue(16, 1);
    expect(getTimes()).toEqual(['00:00:10', '00:00:10', '00:00:10']);
    expect(getMockAudioInstance().play).toHaveBeenCalledTimes(0);

    clickButton('start');
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

    const startButton = getButton('start');
    expect(startButton).toBeTruthy();
    expect(document.activeElement).toBe(startButton);
  });

  it('restarts sequence', () => {
    render();
    fireEvent.click(getToggle('Restart timer when done'));
    focusTimer(0);
    clickButton('add');
    clickButton('add');
    changeInputValue(4, 1);
    changeInputValue(10, 1);
    changeInputValue(16, 1);
    expect(getTimes()).toEqual(['00:00:10', '00:00:10', '00:00:10']);
    expect(getMockAudioInstance().play).toHaveBeenCalledTimes(0);
    clickButton('start');

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
