import React, { useState, memo } from 'react';
import styled from 'styled-components';
import Timer from '../Timer';
import Button from '../Button/Button'; // Assuming Button component path

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
};

const TimerSet = memo(({ initialTime = 0, isActive = true, setTitleTime, onTimeEnd }: Props) => {
  const [timers, setTimers] = useState<TimerConfig[]>([{id: Date.now().toString(), initialTime: initialTime}]);
  const [currentTimerIndex, setCurrentTimerIndex] = useState<number>(0);
  const [isSequenceRunning, setIsSequenceRunning] = useState(isActive);
  const [focusIndex, setFocusIndex] = useState<number | null>(0);

  const addTimer = () => {
    const newTimer: TimerConfig = {
      id: Date.now().toString(),
      initialTime: initialTime,
    };
    setTimers(prevTimers => [...prevTimers, newTimer]);
  };

  const removeTimer = (id: string) => {
    setTimers(prevTimers => prevTimers.filter(timer => timer.id !== id));
  };

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
            isRunning={currentTimerIndex === index && isSequenceRunning}
            restart={false} // TODO: Move restart to TimerSet
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

export default TimerSet; 