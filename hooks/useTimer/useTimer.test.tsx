import { renderHook, act } from '@testing-library/react';
import { mockTime, advanceSeconds } from '../../tests/timerMock';
import useTimer from './useTimer';

const renderUseTimer = (
  initialTime: number, 
  onTimeEnd: () => void = jest.fn()
) => {
  const renderResult = renderHook(
    () => useTimer(initialTime, onTimeEnd)
  );
  return renderResult;
};

describe('useTimer Hook', () => {
  beforeEach(() => {
    mockTime();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with the initial time', () => {
    const initialTime = 10;
    const { result } = renderUseTimer(initialTime);
    expect(result.current.time).toBe(initialTime);
  });

  it('should not change time without starting timer', () => {
    const initialTime = 10;
    const { result } = renderUseTimer(initialTime);
    act(() => {
      advanceSeconds(5);
    });
    expect(result.current.time).toBe(initialTime);
  });

  it('should decrease time by 1 every second after starting timer', () => {
    const initialTime = 10;
    const secondsToAdvance = 3;
    const { result } = renderUseTimer(initialTime);
    result.current.startTimer();
    act(() => {
      advanceSeconds(secondsToAdvance);
    });
    expect(result.current.time).toBe(initialTime - secondsToAdvance);
  });

  it('should stop to initialTimeSeconds when timer reaches zero', () => {
    const initialTime = 10;
    const { result } = renderUseTimer(initialTime);
    result.current.startTimer();
    advanceSeconds(1);
    expect(result.current.time).toBe(initialTime - 1);

    advanceSeconds(initialTime - 1);
    expect(result.current.time).toBe(initialTime);
    advanceSeconds(1);
    expect(result.current.time).toBe(initialTime);
  });

  it('should call onTimeEnd when timer reaches zero', () => {
    const initialTime = 2;
    const onTimeEndMock = jest.fn();
    const { result } = renderHook(() =>
      useTimer(initialTime, onTimeEndMock)
    );

    result.current.startTimer();

    act(() => {
      advanceSeconds(initialTime - 1);
    });
    expect(onTimeEndMock).not.toHaveBeenCalled();
    expect(result.current.time).toBe(1);

    act(() => {
      advanceSeconds(1);
    });
    expect(result.current.time).toBe(2);
    expect(onTimeEndMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onTimeEnd if initialTimeSeconds is 0', () => {
    const initialTime = 0;
    const onTimeEndMock = jest.fn();
    const { result } = renderHook(() =>
      useTimer(initialTime, onTimeEndMock)
    );
    result.current.startTimer();
    act(() => {
       advanceSeconds(1);
    });
    expect(onTimeEndMock).not.toHaveBeenCalled();
  });

  it('should not call onTimeEnd when starting timer', () => {
    const initialTime = 0;
    const onTimeEndMock = jest.fn();
    const { rerender } = renderHook(
      (props: { initial: number }) => useTimer(props.initial, onTimeEndMock),
      { initialProps: { initial: initialTime } }
  );
    const updatedTime = 10;
    rerender({ initial: updatedTime });
    act(() => {
       advanceSeconds(1);
    });
    expect(onTimeEndMock).not.toHaveBeenCalled();
  });

  describe('startTimer', () => {
    it('should start timer when startTimer is called', () => {
      const initialTime = 5;
      const onTimeEndMock = jest.fn();
      const { result } = renderHook(() =>
        useTimer(initialTime, onTimeEndMock)
      );

      expect(result.current.time).toBe(initialTime);

      act(() => {
        advanceSeconds(initialTime);
      });
      expect(onTimeEndMock).toHaveBeenCalledTimes(0);

      result.current.startTimer();

      act(() => {
         advanceSeconds(1);
      });
      expect(result.current.time).toBe(initialTime - 1);

      act(() => {
        advanceSeconds(initialTime - 2);
      });
      expect(result.current.time).toBe(1);
      expect(onTimeEndMock).toHaveBeenCalledTimes(0);

      act(() => {
        advanceSeconds(1);
      });
      expect(result.current.time).toBe(5);
      expect(onTimeEndMock).toHaveBeenCalledTimes(1);
    });

    it('should restart timer from initialTimeSeconds when startTimer is called after timer reaches 0', () => {
        const initialTime = 5;
        const onTimeEndMock = jest.fn();
        const { result } = renderHook(() =>
          useTimer(initialTime, onTimeEndMock)
        );
        result.current.startTimer();
        advanceSeconds(initialTime);
        expect(onTimeEndMock).toHaveBeenCalledTimes(1);
  
        advanceSeconds(1);
        expect(result.current.time).toBe(initialTime);
        expect(onTimeEndMock).toHaveBeenCalledTimes(1);
  
        result.current.startTimer();
        advanceSeconds(1);
        expect(result.current.time).toBe(initialTime - 1);
        expect(onTimeEndMock).toHaveBeenCalledTimes(1);

        advanceSeconds(initialTime - 1);
        expect(result.current.time).toBe(initialTime);
        expect(onTimeEndMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('stopTimer', () => {
    it('should pause timer when stopTimer is called', () => {
        const initialTime = 10;
        const { result } = renderHook(() =>
          useTimer(initialTime, jest.fn())
        );
        result.current.startTimer();
        advanceSeconds(1)
        expect(result.current.time).toBe(initialTime - 1);

        result.current.stopTimer();
        advanceSeconds(1);
        expect(result.current.time).toBe(initialTime - 1);

        result.current.startTimer();
        advanceSeconds(1);
        expect(result.current.time).toBe(initialTime - 2);
    });
  });

  it('should reset timer to new initialTimeSeconds when prop changes', () => {
      const initialTime1 = 10;
      const initialTime2 = 30;
      const { result, rerender } = renderHook(
          (props: { initial: number }) => useTimer(props.initial, jest.fn()),
          { initialProps: { initial: initialTime1 } }
      );
      result.current.startTimer();
      advanceSeconds(3);
      expect(result.current.time).toBe(initialTime1 - 3);

      rerender({ initial: initialTime2 });
      advanceSeconds(0);

      expect(result.current.time).toBe(initialTime2);
      
      advanceSeconds(5);
      expect(result.current.time).toBe(initialTime2 - 5);
  });
}); 