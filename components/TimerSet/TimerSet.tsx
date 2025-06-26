import { useState, memo, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import Timer from '../Timer';
import Button from '../Button/Button';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';
import { v4 as uuid } from 'uuid';
import Hidable from '../Hidable/Hidable';
import useTimers from '../../hooks/useTimers/useTimers';
import { FaPlus, FaTrash } from 'react-icons/fa';
import ScrollableList, { ChildWithKey } from '../ScrollableList/ScrollableList';
import useWakeLock from '../../hooks/useWakeLock/useWakeLock';

const StyledTimer = styled(Timer)``;

const TimerSetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 20px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 10px; /* Space between control buttons */
  margin-bottom: 20px;
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
    const { request: requestWakeLock, release: releaseWakeLock } =
      useWakeLock();

    const addTimer = () => {
      const newTimerIndex = currentTimerIndex + 1;
      addTimerAtIndex(newTimerIndex, {
        id: uuid(),
        initialTime: initialTime,
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
      if (window.umami) {
        window.umami.track('Start timer');
      }
      requestWakeLock();
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

    const stopTimer = useCallback(() => {
      releaseWakeLock();
      setIsSequenceRunning(false);
      focusStart();
    }, [focusStart, releaseWakeLock, setIsSequenceRunning]);

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
        } else {
          setIsNewTimerSet(true);
        }
        stopTimer();
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
          stopTimer();
        } else {
          setFocusIndex(currentTimerIndex);
          setIsSequenceRunning(true);
        }
      }
    }, [
      stopTimer,
      currentTimerIndex,
      setFocusIndex,
      setIsSequenceRunning,
      isSequenceRunning,
      focusStart,
      focusIndex,
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
          stopTimer();
        }
      },
      [isSequenceRunning, stopTimer]
    );

    const handleScroll = useCallback(
      (index: number) => {
        setFocusIndex(null);
        setCurrentTimerIndex(index);
      },
      [setFocusIndex, setCurrentTimerIndex]
    );

    return (
      <TimerSetWrapper
        onClick={handleWrapperClick}
        data-testid="timer-set-wrapper"
      >
        <ScrollableList
          selectedIndex={currentTimerIndex}
          onSelectedIndexChange={handleScroll}
          allowScrolling={!isSequenceRunning}
          controls={
            <>
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
            </>
          }
        >
          {
            timers.map((timerConfig, index) => (
              <StyledTimer
                key={timerConfig.id}
                initialTime={timerConfig.initialTime}
                isRunning={currentTimerIndex === index && isSequenceRunning} // TODO: Move restart to TimerSet
                onTimeEnd={onTimerEnd}
                setTitleTime={setTitleTime}
                onFocus={onFocus(index)}
                isFocused={focusIndex === index}
                onChange={onChangeTimer(index)}
                onDirty={onDirty}
              />
            )) as ChildWithKey[]
          }
        </ScrollableList>
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
