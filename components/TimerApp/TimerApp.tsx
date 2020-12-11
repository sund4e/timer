import styled from 'styled-components';
import Timer from '../Timer';
import NotificationToggle from '../NotificationToggle';
import Toggle from '../Toggle';
import { useState, useEffect } from 'react';
import SideMenu from '../SideMenu';
import { Theme } from '../../styles/theme';

const StyledTimer = styled(Timer)`
  font-size: min(18vw, ${({ theme }: { theme: Theme }) =>
    theme.fontSizes.big}rem);
  max-fontSize
`;

const Header = styled.h1`
  font-size: ${({ theme }: { theme: Theme }) => theme.fontSizes.medium}rem;
  margin-bottom: ${({ theme }: { theme: Theme }) =>
    theme.fontSizes.medium / 5}rem;
`;

const SubHeader = styled.h2`
  font-size: ${({ theme }: { theme: Theme }) =>
    theme.fontSizes.medium * 0.5}rem;
  margin-bottom: ${({ theme }: { theme: Theme }) =>
    theme.fontSizes.medium / 5}rem;
`;

const Text = styled.p`
  margin-top: ${({ theme }: { theme: Theme }) => theme.fontSizes.medium / 5}rem;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  align-items: stretch;
  overflow: hidden;
`;

export type Props = {
  initialTime: number;
  isActive: boolean;
};

const TimerApp = ({ initialTime = 0, isActive = true }: Props) => {
  const [notify, setNotify] = useState<(() => void) | null>(null);
  const [restart, setRestart] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
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
        isActive={isActive}
        initialTime={initialTime}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
      />
      <SideMenu>
        <Header>Timer</Header>
        <Text>Simple, yet beautiful online timer to do great things.</Text>
        <SubHeader>Settings</SubHeader>
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
