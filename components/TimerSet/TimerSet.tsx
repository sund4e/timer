import { useState, memo, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Timer from '../Timer';
import Button from '../Button/Button'; // Assuming Button component path
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';
import { v4 as uuid } from 'uuid';

type TimerConfig = {
  id: string;
  initialTime: number; // in seconds
  enterAnimation?: boolean;
};

const fontSize = 5 //vh
const margin = 3 //vh

const StyledTimer = styled(Timer)<{$position: number}>`
  position: absolute;
  font-size: ${fontSize}vh;
  transition:
    opacity ${({ theme }) => theme.transition}s ease-out,
    scale ${({ theme }) => theme.transition}s ease-out,
    transform ${({ theme }) => theme.transition}s ease-out;
  opacity: 1;
  &.active {
    transform: scale(2);
  }
  &.enter-animation {
    opacity: 0;
  }
  ${({ $position }) => $position && `transform: translateY(${$position * (fontSize + margin)}vh);`}
  opacity: ${({ $position }) => Math.abs($position) > 4 ? 0 : 1};
`;

const TimerSetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
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

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px; /* Space between control buttons */
`;

export type Props = {
  initialTime: number;
  isActive: boolean;
  setTitleTime: (seconds: number) => void;
  onTimeEnd: () => void;
  restart: boolean;
};

const TimerSet = memo(({ initialTime = 0, isActive = true, setTitleTime, onTimeEnd, restart = false }: Props) => {
  const [timers, setTimers] = useState<TimerConfig[]>([{id: Date.now().toString(), initialTime: initialTime}]);
  const [currentTimerIndex, setCurrentTimerIndex] = useState<number>(0);
  const [isSequenceRunning, setIsSequenceRunning] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  
  const addTimer = () => {
    const newTimer: TimerConfig = {
      id: uuid(),
      initialTime: initialTime,
      enterAnimation: true,
    };
    setTimers(prevTimers => {
      const newTimers = [...prevTimers];
      newTimers.splice(currentTimerIndex +1, 0, newTimer);
      setCurrentTimerIndex(currentTimerIndex + 1);
      return newTimers;
    });
  };

  const removeTimer = () => {
    if (timers.length === 1) {
      return;
    }
    setCurrentTimerIndex(Math.max(currentTimerIndex - 1, 0));
    setTimers(prevTimers => prevTimers.filter((_, index) => index !== currentTimerIndex));
  };

  useEffect(() => {
    const currentTimer = timers[currentTimerIndex]
    if (currentTimer.enterAnimation) {
      const newTimer = {...currentTimer, enterAnimation: false}
      setTimers(prevTimers => {
        const newTimers = [...prevTimers];
        newTimers.splice(currentTimerIndex, 1, newTimer);
        return newTimers;
      });
    }
  }, [timers, currentTimerIndex]);

  useEffect(() => {
    if (currentTimerIndex === timers.length - 1 &&
      !isSequenceRunning &&
      restart &&
      focusIndex === null &&
      isActive
    ) {
      setIsSequenceRunning(true);
    }
  }, [isSequenceRunning, restart, focusIndex, currentTimerIndex, isActive]);

  const onFocus = (index: number) => () => {
    setCurrentTimerIndex(index);
    setFocusIndex(index);
    setIsSequenceRunning(false);
  };

  const onTimerEnd = () => {
    onTimeEnd();
    if (currentTimerIndex === timers.length - 1) {
      if (restart && timers.length > 1) {
        setCurrentTimerIndex(0);
      } else {
        setIsSequenceRunning(false);
      }
    } else {
      setCurrentTimerIndex(Math.min(currentTimerIndex + 1, timers.length - 1));
    }
  };

  const onEnter = useCallback(() => {
    if (focusIndex !== null) {
      setFocusIndex(null);
      if(currentTimerIndex === timers.length - 1) {
        setIsSequenceRunning(true);
      }
    } else {
      setFocusIndex(currentTimerIndex);
      setIsSequenceRunning(false);
    }
  }, [focusIndex, currentTimerIndex, setFocusIndex, setIsSequenceRunning, timers]);

  useKeyPressCallBack(null, 'Enter', onEnter);

  const onStart = () => {
    setIsSequenceRunning(true);
    setFocusIndex(null);
    setCurrentTimerIndex(0);
  };

  return (
    <TimerSetWrapper>
      <TimersList>
        {timers.map((timerConfig, index) => (
          <StyledTimer
            key={timerConfig.id}
            initialTime={timerConfig.initialTime}
            isRunning={currentTimerIndex === index && isSequenceRunning}// TODO: Move restart to TimerSet
            onTimeEnd={onTimerEnd}
            setTitleTime={setTitleTime}
            onFocus={onFocus(index)}
            isFocused={focusIndex === index}
            className={[
              currentTimerIndex === index ? 'active' : '',
              timerConfig.enterAnimation ? 'enter-animation' : ''
            ].filter(Boolean).join(' ')}
            $position={index - currentTimerIndex}
          />
        ))}
      </TimersList>
      <Controls>
        <Button onClick={addTimer} isHidden={isSequenceRunning} data-testid="add-button">
          Add
        </Button>
        <Button onClick={removeTimer} isHidden={isSequenceRunning || timers.length === 1} data-testid="remove-button">
          Remove
        </Button>
        <Button onClick={onStart} isHidden={isSequenceRunning} data-testid="start-button">
          Start
        </Button>
      </Controls>
    </TimerSetWrapper>
  );
});

TimerSet.displayName = 'TimerSet';

export default TimerSet; 