import TimerApp from './TimerApp';
import { render as renderElement } from '../../tests/render';
import { fireEvent, screen, act, waitFor } from '@testing-library/react';
import { getTime } from '../../tests/helpers';
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
    initialTime: 20 * 60,
    isActive: true,
    setTitleTime: () => {},
    ...override,
  };
  return renderElement(<TimerApp {...props} />);
};

describe('timerApp', () => {
  beforeEach(() => {
    mockTime();
  });

  afterEach(() => {
    jest.useRealTimers();
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
    render();
    expect(getTime()).toEqual('00:20:00');
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.focus(inputs[2]);
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:59');

    fireEvent.blur(inputs[2]);
    advanceSeconds(1);
    expect(getTime()).toEqual('00:19:58');
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

  describe('sound functionality', () => {
    beforeEach(() => {
      setupAudioMock();
    });

    afterEach(() => {
      restoreAudioMock();
      Object.defineProperty(window.navigator, 'userAgent', {
          value: originalUserAgent,
          writable: true,
          configurable: true
      });
    });

    // Helper to get the Sound Toggle input element
    const getSoundToggle = () => {
      const soundLabel = screen.getByText('Sound');
      const toggleInput = soundLabel.parentElement?.querySelector('input[type="checkbox"], input[role="switch"]') || screen.getByRole('switch', { name: /sound/i });
      if (!toggleInput) throw new Error("Could not find Sound toggle input");
      return toggleInput as HTMLInputElement;
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

          advanceSeconds(initialTime);

          expect(getMockAudioInstance().play).toHaveBeenCalledTimes(1);
       });
    });
  });
});
