import { renderHook, act, RenderHookResult } from '@testing-library/react';
import { mockTime, advanceSeconds } from '../../tests/timerMock';
import useTimer from './useTimer';

const renderUseTimer = (
  initialTime: number, 
  isRunning: boolean, 
  restart: boolean, 
  onTimeEnd: () => void = jest.fn()
): RenderHookResult<{ time: number }, unknown> => {
  const renderResult = renderHook(
    () => useTimer(initialTime, onTimeEnd, isRunning, restart)
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
    const { result } = renderUseTimer(initialTime, false, false);
    expect(result.current.time).toBe(initialTime);
  });

  it('should not decrease time when isRunning is false', () => {
    const initialTime = 10;
    const { result } = renderUseTimer(initialTime, false, false);
    act(() => {
      advanceSeconds(5);
    });
    expect(result.current.time).toBe(initialTime);
  });

  it('should decrease time by 1 every second when isRunning is true', () => {
    const initialTime = 10;
    const secondsToAdvance = 3;
    const { result } = renderUseTimer(initialTime, true, false);
    act(() => {
      advanceSeconds(secondsToAdvance);
    });
    expect(result.current.time).toBe(initialTime - secondsToAdvance);
  });

  it('should call onTimeEnd when timer reaches zero', () => {
    const initialTime = 2;
    const onTimeEndMock = jest.fn();
    const { result } = renderHook(() =>
      useTimer(initialTime, onTimeEndMock, true, false)
    );

    act(() => {
      advanceSeconds(initialTime - 1);
    });
    expect(onTimeEndMock).not.toHaveBeenCalled();
    expect(result.current.time).toBe(1);

    act(() => {
      advanceSeconds(1);
    });
    expect(result.current.time).toBe(0);
    expect(onTimeEndMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onTimeEnd if initialTimeSeconds is 0', () => {
    const initialTime = 0;
    const onTimeEndMock = jest.fn();
    renderHook(() =>
      useTimer(initialTime, onTimeEndMock, true, false)
    );
    act(() => {
       advanceSeconds(1);
    });
    expect(onTimeEndMock).not.toHaveBeenCalled();
  });

  describe('restart functionality', () => {
    it('should restart timer from initialTimeSeconds if restart is true', () => {
        const initialTime = 5;
        const onTimeEndMock = jest.fn();
        const { result } = renderHook(() =>
          useTimer(initialTime, onTimeEndMock, true, true)
        );
  
        act(() => {
          advanceSeconds(initialTime);
        });
        expect(onTimeEndMock).toHaveBeenCalledTimes(1);
  
        act(() => {
           advanceSeconds(1);
        });
        expect(result.current.time).toBe(initialTime - 1);
  
        act(() => {
          advanceSeconds(initialTime - 2);
        });
        expect(result.current.time).toBe(1);
        expect(onTimeEndMock).toHaveBeenCalledTimes(1);

        act(() => {
          advanceSeconds(1);
        });
        expect(onTimeEndMock).toHaveBeenCalledTimes(2);
        
        act(() => {
          advanceSeconds(1);
        });
        expect(result.current.time).toBe(initialTime - 1);
        expect(onTimeEndMock).toHaveBeenCalledTimes(2);
    });

    it('should stop timer at 0 if restart is false', () => {
       const initialTime = 5;
       const onTimeEndMock = jest.fn();
       const { result } = renderHook(() =>
         useTimer(initialTime, onTimeEndMock, true, false)
       );

       act(() => {
         advanceSeconds(initialTime);
       });
       expect(result.current.time).toBe(0);
       expect(onTimeEndMock).toHaveBeenCalledTimes(1);

       act(() => {
         advanceSeconds(3);
       });
       expect(result.current.time).toBe(0);
       expect(onTimeEndMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop changes', () => {
    it('should pause timer when isRunning changes from true to false', () => {
        const initialTime = 10;
        const { result, rerender } = renderHook(
            (props: { isRunning: boolean }) => useTimer(initialTime, jest.fn(), props.isRunning, false),
            { initialProps: { isRunning: true } }
        );
        act(() => { advanceSeconds(3); });
        expect(result.current.time).toBe(initialTime - 3);

        rerender({ isRunning: false });
        act(() => { advanceSeconds(0); });
        
        act(() => { advanceSeconds(4); });
        expect(result.current.time).toBe(initialTime - 3);
    });

    it('should start timer when isRunning changes from false to true', () => {
        const initialTime = 10;
        const { result, rerender } = renderHook(
            (props: { isRunning: boolean }) => useTimer(initialTime, jest.fn(), props.isRunning, false),
            { initialProps: { isRunning: false } }
        );
        expect(result.current.time).toBe(initialTime);

        rerender({ isRunning: true });
        act(() => { advanceSeconds(0); });
        
        act(() => { advanceSeconds(2); });
        expect(result.current.time).toBe(initialTime - 2);
    });

    it('should reset timer to new initialTimeSeconds when prop changes', () => {
        const initialTime1 = 10;
        const initialTime2 = 30;
        const { result, rerender } = renderHook(
            (props: { initial: number }) => useTimer(props.initial, jest.fn(), true, false),
            { initialProps: { initial: initialTime1 } }
        );
        act(() => { advanceSeconds(3); });
        expect(result.current.time).toBe(initialTime1 - 3);

        rerender({ initial: initialTime2 });
        act(() => { advanceSeconds(0); });

        expect(result.current.time).toBe(initialTime2);
        
        act(() => { advanceSeconds(5); });
        expect(result.current.time).toBe(initialTime2 - 5);
    });
  });
}); 