import styled from 'styled-components';
import Timer from '../Timer';
import NotificationToggle from '../NotificationToggle';
import Toggle from '../Toggle';
import { memo, useState, useEffect } from 'react';
import SideMenu from '../SideMenu';
import Tooltip from '../Tooltip';

const StyledTimer = styled(Timer)`
  font-size: min(16vw, ${({ theme }) => theme.fontSizes.big}rem);
`;

const Header = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.medium}rem;
  margin-bottom: ${({ theme }) => theme.fontSizes.medium / 5}rem;
`;

const SubHeader = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.medium * 0.5}rem;
  margin-bottom: ${({ theme }) => theme.fontSizes.medium / 5}rem;
`;

const Text = styled.p`
  margin-top: ${({ theme }) => theme.fontSizes.medium / 5}rem;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  align-items: center;
  overflow: hidden;
`;

export type Props = {
  initialTime: number;
  isActive: boolean;
  setTitleTime: (seconds: number) => void;
};

const TimerApp = memo(
  ({ initialTime = 0, isActive = true, setTitleTime }: Props) => {
    const [notify, setNotify] = useState<(() => void) | null>(null);
    const [restart, setRestart] = useState(true);
    const [playSound, setPlaySound] = useState(true);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
      //preload the audio after render
      const audio = new Audio('/bell.wav');
      audio.addEventListener('canplaythrough', () => {
        setAudio(audio);
      });
    }, []);

    function onTimeEnd() {
      if (playSound && audio) {
        audio.currentTime = 0;
        audio.play();
      }
      if (notify) {
        notify();
      }
    }

    return (
      <Wrapper>
        <StyledTimer
          restart={restart}
          onTimeEnd={onTimeEnd}
          isActive={isActive}
          initialTime={initialTime}
          setTitleTime={setTitleTime}
        />
        <SideMenu>
          <Header>Aika Timer</Header>
          <Text>
            "Aika" is Finnish and means time. It's also a simple, yet beautiful
            online timer with alerts and ability to set recurring reminders.
          </Text>
          <SubHeader>Settings</SubHeader>
          <Toggle isOn={playSound} setIsOn={setPlaySound}>
            Sound
          </Toggle>
          <NotificationToggle setNotify={(notify) => setNotify(() => notify)}>
            {(isDenied) => (
              <>
                Notifications{' '}
                {isDenied && (
                  <Tooltip>
                    Can't enable notifications since they are disabled in the
                    browser settings
                  </Tooltip>
                )}
              </>
            )}
          </NotificationToggle>
          <Toggle isOn={restart} setIsOn={setRestart}>
            Restart timer when done
          </Toggle>
        </SideMenu>
      </Wrapper>
    );
  }
);

export default TimerApp;
