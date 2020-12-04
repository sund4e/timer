import styled from 'styled-components';
import Timer from '../Timer';
import NotificationToggle from '../NotificationToggle';
import Toggle from '../Toggle';
import { useState } from 'react';
import SideMenu from '../SideMenu';
import { Theme } from '../../styles/theme';
import { FocusContextProvider, useFocusIndex } from '../FocusContext';

const StyledTimer = styled(Timer)`
  font-size: ${({ theme }: { theme: Theme }) => theme.fontSizes.big}vw;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  align-items: stretch;
  overflow: hidden;
`;

const TimerApp = () => {
  const [notify, setNotify] = useState<(() => void) | null>(null);
  const [restart, setRestart] = useState(true);
  const [isFocused, setIsFocused] = useState(true);
  const [playSound, setPlaySound] = useState(true);

  function onTimeEnd() {
    if (playSound) {
      const audio = new Audio('/bell.wav');
      audio.play();
    }
    if (notify) {
      notify();
    }
  }

  const onClickWrapper = () => {
    setIsFocused(false);
  };

  return (
    <Wrapper onClick={onClickWrapper}>
      <StyledTimer
        restart={restart}
        onTimeEnd={onTimeEnd}
        isActive={true}
        initialTime={1200}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
      />
      <SideMenu>
        <Toggle isOn={playSound} setIsOn={setPlaySound} label={'Sound'} />
        <NotificationToggle setNotify={(notify) => setNotify(() => notify)} />
        <Toggle
          isOn={restart}
          setIsOn={setRestart}
          label={'Restart timer when done'}
        />
      </SideMenu>
    </Wrapper>
  );
};

export default TimerApp;
