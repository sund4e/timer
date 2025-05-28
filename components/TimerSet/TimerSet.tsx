import { useState, memo, useEffect, useCallback, useRef, useMemo } from 'react';
import styled from 'styled-components';
import Timer from '../Timer';
import Button from '../Button/Button';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';
import { v4 as uuid } from 'uuid';
import Hidable from '../Hidable/Hidable';
import useTimers from '../../hooks/useTimers/useTimers';
import { FaPlus, FaTrash } from 'react-icons/fa';
import throttle from 'lodash/throttle';

const fontSizeActive = 20;
const fontSizeInactive = 5;
const visibleTimers = 4;

const fontSize = `min(${fontSizeActive}vw, ${fontSizeActive}vh)`;

const StyledTimer = styled(Timer)<{ $position: number }>`
  position: absolute;
  font-size: ${fontSize};
  transition:
    opacity ${({ theme }) => theme.transition}s ease-out,
    scale ${({ theme }) => theme.transition}s ease-out,
    transform ${({ theme }) => theme.transition}s ease-out;
  opacity: 1;
  &.enter-animation {
    opacity: 0;
  }
  ${({ $position }) => {
    const multiplier = $position === 0 ? 0 : $position > 0 ? 1 : -1; // 0 for center, 1 for up, -1 for down
    return `transform: translateY(calc(${multiplier * Math.abs($position) * fontSizeInactive}vh + ${multiplier} * ${fontSize} / 2)) scale(${$position ? fontSizeInactive / fontSizeActive : 1});`;
  }}
  opacity: ${({ $position }) => (Math.abs($position) >= visibleTimers ? 0 : 1)};
`;

const TimerSetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  gap: 20px; /* Space between timers and controls */
  padding: 20px;
`;

const TimersList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  gap: 15px; /* Space between individual timers */
  position: relative; /* Ensure absolute children are contained */
  overflow: hidden; /* Prevent children from overflowing this container */
  width: 100%; /* Take full available width */
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 10px; /* Space between control buttons */
`;

const TimerSetControls = styled.div<{
  $timersLength: number;
  $currentTimerIndex: number;
}>`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  transition: transform ${({ theme }) => theme.transition}s ease-out;
  ${({ $timersLength, $currentTimerIndex }) =>
    `transform: translateY(${Math.min(visibleTimers + 1, $timersLength - $currentTimerIndex) * fontSizeInactive + fontSizeActive / 2 + 3}vh);`}
  gap: 10px;
  margin-top: 1vh;
`;

export type Props = {
  initialTime: number;
  isActive: boolean;
  setTitleTime: (seconds: number) => void;
  onTimeEnd: () => void;
  restart: boolean;
};

const TimerSet = memo(
  ({ initialTime = 0, setTitleTime, onTimeEnd, restart = false }: Props) => {
    const {
      timers,
      addTimerAtIndex,
      removeTimerAtIndex,
      resetTimers,
      editTimerAtIndex,
    } = useTimers([{ id: uuid(), initialTime: initialTime }]);
    const [currentTimerIndex, setCurrentTimerIndex] = useState<number>(0);
    const [isSequenceRunning, setIsSequenceRunning] = useState(false);
    const [focusIndex, setFocusIndex] = useState<number | null>(null);
    const [restartSequence, setRestartSequence] = useState(false);
    const startButtonRef = useRef<HTMLButtonElement>(null);
    const resumeButtonRef = useRef<HTMLButtonElement>(null);
    const [isNewTimerSet, setIsNewTimerSet] = useState(true);

    const addTimer = () => {
      const newTimerIndex = currentTimerIndex + 1;
      addTimerAtIndex(newTimerIndex, {
        id: uuid(),
        initialTime: initialTime,
        enterAnimation: true,
      });
      setCurrentTimerIndex(newTimerIndex);
    };

    const removeTimer = () => {
      removeTimerAtIndex(currentTimerIndex);
      setCurrentTimerIndex(Math.max(currentTimerIndex - 1, 0));
    };

    useEffect(() => {
      if (restartSequence) {
        setCurrentTimerIndex(0);
        setIsSequenceRunning(true);
        setRestartSequence(false);
      }
    }, [restartSequence, restart]);

    const runSequence = () => {
      setIsSequenceRunning(true);
      setFocusIndex(null);
    };

    const resetSequence = () => {
      resetTimers();
      setIsNewTimerSet(true);
      setCurrentTimerIndex(0);
      focusStart();
    };

    const startSequence = () => {
      setCurrentTimerIndex(0);
      runSequence();
    };

    const focusStart = useCallback(() => {
      setFocusIndex(null);
      if (startButtonRef.current) {
        startButtonRef.current.focus();
      } else {
        resumeButtonRef.current?.focus();
      }
    }, [startButtonRef, resumeButtonRef]);

    useEffect(() => {
      const currentTimer = timers[currentTimerIndex];
      if (currentTimer.enterAnimation) {
        editTimerAtIndex(currentTimerIndex, { enterAnimation: false });
      }
    }, [timers, currentTimerIndex, editTimerAtIndex]);

    // Focus start button when sequence stopped and no other element is focused
    useEffect(() => {
      if (!isSequenceRunning && document.activeElement === document.body) {
        focusStart();
      }
    }, [isSequenceRunning, focusStart, isNewTimerSet]); // isNewTimerSet so start is focused after reset

    // Set dirty state after sequence first started
    useEffect(() => {
      if (isSequenceRunning && isNewTimerSet) {
        setIsNewTimerSet(false);
      }
    }, [isSequenceRunning, isNewTimerSet]);

    // Ensure current timer index always poits to focus index
    useEffect(() => {
      if (focusIndex) {
        setCurrentTimerIndex(focusIndex);
      }
    }, [focusIndex]);

    const onFocus = (index: number) => () => {
      setCurrentTimerIndex(index);
      setFocusIndex(index);
      setIsSequenceRunning(false);
    };

    const onTimerEnd = () => {
      onTimeEnd();
      if (currentTimerIndex === timers.length - 1) {
        if (restart) {
          setRestartSequence(true);
        }
        setIsSequenceRunning(false);
      } else {
        setCurrentTimerIndex(
          Math.min(currentTimerIndex + 1, timers.length - 1)
        );
      }
    };

    const onEnter = useCallback(() => {
      const activeElement = document.activeElement as HTMLElement | null;

      if (activeElement?.tagName === 'BUTTON') {
        // default event is prevented, we need to simulate click
        activeElement.click();
        activeElement.blur();
        return;
      }

      if (focusIndex !== null) {
        focusStart();
      } else {
        if (isSequenceRunning) {
          setIsSequenceRunning(false);
          focusStart();
        } else {
          setFocusIndex(currentTimerIndex);
          setIsSequenceRunning(true);
        }
      }
    }, [
      focusIndex,
      currentTimerIndex,
      setFocusIndex,
      setIsSequenceRunning,
      isSequenceRunning,
      focusStart,
    ]);

    const moveUp = useCallback(() => {
      if (
        document.activeElement === startButtonRef.current ||
        document.activeElement === resumeButtonRef.current
      ) {
        setFocusIndex(timers.length - 1);
      } else if (focusIndex) {
        const newIndex = Math.max(focusIndex - 1, 0);
        setFocusIndex(newIndex);
      }
    }, [focusIndex, timers]);

    const moveDown = useCallback(() => {
      if (focusIndex !== null) {
        const lastIndex = timers.length - 1;
        if (focusIndex === lastIndex) {
          focusStart();
        } else {
          setFocusIndex(focusIndex + 1);
        }
      }
    }, [timers, focusIndex, focusStart]);

    useKeyPressCallBack(null, 'Enter', onEnter);
    useKeyPressCallBack(null, 'ArrowUp', moveUp);
    useKeyPressCallBack(null, 'ArrowDown', moveDown);

    const onChangeTimer = useCallback(
      (index: number) => (seconds: number) => {
        const nextFocusIndex = index + 1;
        if (nextFocusIndex < timers.length) {
          setFocusIndex(nextFocusIndex);
        }

        editTimerAtIndex(index, { initialTime: seconds });
        setIsNewTimerSet(true);
      },
      [timers, editTimerAtIndex]
    );

    const onDirty = useCallback(() => {
      setIsNewTimerSet(true);
    }, []);

    const handleWrapperClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        // Prevent click from bubbling up if it originated from a button or input
        if (
          event.target instanceof HTMLElement &&
          (event.target.tagName === 'BUTTON' ||
            event.target.tagName === 'INPUT')
        ) {
          return;
        }

        if (isSequenceRunning) {
          setIsSequenceRunning(false);
          focusStart();
        }
      },
      [isSequenceRunning, setIsSequenceRunning, focusStart]
    );

    const scrollTimers = useCallback(
      (deltaY: number) => {
        if (Math.abs(deltaY) <= 10) return;

        if (deltaY > 10) {
          setFocusIndex((prevFocusIndex) => {
            if (prevFocusIndex === null) return 0;
            return Math.min(prevFocusIndex + 1, timers.length - 1);
          });
        } else if (deltaY < -10) {
          setFocusIndex((prevFocusIndex) => {
            if (prevFocusIndex === null) return timers.length - 1;
            return Math.max(prevFocusIndex - 1, 0);
          });
        }
      },
      [timers.length]
    );

    const throttledScrollTimers = useMemo(
      () => throttle(scrollTimers, 300, { leading: true, trailing: false }),
      [scrollTimers]
    );

    useEffect(() => {
      return () => {
        throttledScrollTimers.cancel();
      };
    }, [throttledScrollTimers]);

    const touchStartY = useRef(0);

    const handleTouchStart = useCallback(
      (event: React.TouchEvent<HTMLDivElement>) => {
        touchStartY.current = event.touches[0].clientY;
      },
      []
    );

    const handleTouchMove = useCallback(
      (event: React.TouchEvent<HTMLDivElement>) => {
        const deltaY = touchStartY.current - event.touches[0].clientY;
        throttledScrollTimers(deltaY);
      },
      [throttledScrollTimers]
    );

    const handleWheel = useCallback(
      (event: React.WheelEvent<HTMLDivElement>) => {
        if (timers.length <= 1 || focusIndex === null) {
          return;
        }
        throttledScrollTimers(event.deltaY);
      },
      [timers.length, focusIndex, throttledScrollTimers]
    );

    return (
      <TimerSetWrapper
        onClick={handleWrapperClick}
        data-testid="timer-set-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
      >
        <TimersList>
          {timers.map((timerConfig, index) => (
            <StyledTimer
              key={timerConfig.id}
              initialTime={timerConfig.initialTime}
              isRunning={currentTimerIndex === index && isSequenceRunning} // TODO: Move restart to TimerSet
              onTimeEnd={onTimerEnd}
              setTitleTime={setTitleTime}
              onFocus={onFocus(index)}
              isFocused={focusIndex === index}
              className={[
                currentTimerIndex === index ? 'active' : '',
                timerConfig.enterAnimation ? 'enter-animation' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              $position={index - currentTimerIndex}
              onChange={onChangeTimer(index)}
              onDirty={onDirty}
            />
          ))}
          {!isSequenceRunning && focusIndex !== null && (
            <TimerSetControls
              $timersLength={timers.length}
              $currentTimerIndex={currentTimerIndex}
            >
              <Button
                onClick={addTimer}
                data-testid="add-button"
                aria-label="Add timer"
              >
                <FaPlus fontSize={'70%'} />
              </Button>
              {timers.length > 1 && (
                <Button
                  onClick={removeTimer}
                  data-testid="remove-button"
                  aria-label="Remove timer"
                >
                  <FaTrash fontSize={'70%'} />
                </Button>
              )}
            </TimerSetControls>
          )}
        </TimersList>
        <Row>
          {isNewTimerSet && (
            <Hidable isHidden={isSequenceRunning}>
              <Button
                onClick={startSequence}
                data-testid="start-button"
                ref={startButtonRef}
              >
                Start
              </Button>
            </Hidable>
          )}
          {!isNewTimerSet && (
            <Hidable isHidden={isSequenceRunning}>
              <Button onClick={resetSequence} data-testid="reset-button">
                {'Reset'}
              </Button>
              <Button
                onClick={runSequence}
                data-testid="resume-button"
                ref={resumeButtonRef}
              >
                Resume
              </Button>
            </Hidable>
          )}
        </Row>
      </TimerSetWrapper>
    );
  }
);

TimerSet.displayName = 'TimerSet';

export default TimerSet;
