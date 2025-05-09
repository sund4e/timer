import { useState, memo, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Timer from '../Timer';
import Button from '../Button/Button'; // Assuming Button component path
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';

type TimerConfig = {
  id: string;
  initialTime: number; // in seconds
};

const StyledTimer = styled(Timer)`
  font-size: min(16vw, ${({ theme }) => theme.fontSizes.big}rem);
`;

const TimerSetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px; /* Space between timers and controls */
  padding: 20px;
`;

const TimersList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px; /* Space between individual timers */
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
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
  const [isSequenceRunning, setIsSequenceRunning] = useState(isActive);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addTimer = () => {
    const newTimer: TimerConfig = {
      id: Date.now().toString(),
      initialTime: initialTime,
    };
    setTimers(prevTimers => [...prevTimers, newTimer]);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeTimer = (id: string) => {
    setTimers(prevTimers => prevTimers.filter(timer => timer.id !== id));
  };

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
      setIsSequenceRunning(false);
    } else {
      setCurrentTimerIndex(Math.min(currentTimerIndex + 1));
    }
  };

  const onEnter = useCallback(() => {
    if (focusIndex !== null) {
      setFocusIndex(null);
      setIsSequenceRunning(true);
    } else {
      setFocusIndex(currentTimerIndex);
      setIsSequenceRunning(false);
    }
  }, [focusIndex, currentTimerIndex, setFocusIndex, setIsSequenceRunning]);

  useKeyPressCallBack(null, 'Enter', onEnter);

  const onStart = () => {
    setIsSequenceRunning(true);
    setFocusIndex(null);
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
          />
        ))}
      </TimersList>
      <Controls>
        <Button onClick={onStart} isHidden={isSequenceRunning} data-testid="start-button">
          Start
        </Button>
      </Controls>
    </TimerSetWrapper>
  );
});

TimerSet.displayName = 'TimerSet';

export default TimerSet; 