import { useState, memo, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import Timer from '../Timer';
import Button from '../Button/Button';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';
import { v4 as uuid } from 'uuid';
import Hidable from '../Hidable/Hidable';
import useTimers from '../../hooks/useTimers/useTimers';
import { FaPlus, FaTrash } from 'react-icons/fa';

const fontSizeActive = 20;
const fontSizeInactive = 5;
const visibleTimers = 4;

const StyledTimer = styled(Timer)<{ $position: number }>`
  position: absolute;
  font-size: min(${fontSizeActive}vw, ${fontSizeActive}vh);
  transition:
    opacity ${({ theme }) => theme.transition}s ease-out,
    scale ${({ theme }) => theme.transition}s ease-out,
    transform ${({ theme }) => theme.transition}s ease-out;
  opacity: 1;
  &.enter-animation {
    opacity: 0;
  }
  ${({ $position }) =>
    $position &&
    `transform: translateY(${
      $position === 0
        ? 0
        : $position > 0
          ? $position * fontSizeInactive + fontSizeActive / 2
          : $position * fontSizeInactive - fontSizeActive / 2
    }vh) scale(${$position ? fontSizeInactive / fontSizeActive : 1});`}
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
      setFocusIndex(0);
    };

    const startSequence = () => {
      setCurrentTimerIndex(0);
      runSequence();
    };

    const focusStart = () => {
      setFocusIndex(null);
      if (startButtonRef.current) {
        startButtonRef.current.focus();
      } else {
        resumeButtonRef.current?.focus();
      }
    };

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
    }, [isSequenceRunning]);

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
    }, [timers, focusIndex]);

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

    return (
      <TimerSetWrapper>
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
              <Button onClick={addTimer} data-testid="add-button">
                <FaPlus fontSize={'70%'} />
              </Button>
              {timers.length > 1 && (
                <Button onClick={removeTimer} data-testid="remove-button">
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
