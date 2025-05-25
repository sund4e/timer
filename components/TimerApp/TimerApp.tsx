import styled from 'styled-components';
import NotificationToggle from '../NotificationToggle';
import Toggle from '../Toggle';
import { memo, useState, useEffect } from 'react';
import SideMenu from '../SideMenu';
import Tooltip from '../Tooltip';
import TimerSet from '../TimerSet/TimerSet';

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

const AIKA_INFO_VISIBILITY_THRESHOLD_PX = 480;

const TimerApp = memo(
  ({ initialTime = 0, isActive = true, setTitleTime }: Props) => {
    const [notify, setNotify] = useState<(() => void) | null>(null);
    const [restart, setRestart] = useState(false);
    const [playSound, setPlaySound] = useState(true);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isLikelyMobile, setIsLikelyMobile] = useState(false);
    const [showAikaInfoText, setShowAikaInfoText] = useState(true);

    useEffect(() => {
      const userAgent = navigator.userAgent;
      const isLikelyMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
      setIsLikelyMobile(isLikelyMobile);
    }, []);

    useEffect(() => {
      const audio = new Audio('/bell.wav');
      audio.load();
      audio.addEventListener('canplaythrough', () => {
        setAudio(audio);
      });
    }, []);

    useEffect(() => {
      if (isLikelyMobile) {
        setPlaySound(false);
      }
    }, [isLikelyMobile]);

    useEffect(() => {
      const checkHeight = () => {
        if (window.innerHeight < AIKA_INFO_VISIBILITY_THRESHOLD_PX) {
          setShowAikaInfoText(false);
        } else {
          setShowAikaInfoText(true);
        }
      };

      window.addEventListener('resize', checkHeight);
      checkHeight();

      return () => window.removeEventListener('resize', checkHeight);
    }, []);

    function playAudio() {
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((err) => console.error('Play failed:', err));
      } else {
        console.log('Audio not ready to play.');
      }
    }

    function onTimeEnd() {
      if (playSound) {
        playAudio();
      }
      if (notify) {
        notify();
      }
    }

    const handleSoundToggle = (newValue: boolean) => {
      setPlaySound(newValue);
      if (newValue && isLikelyMobile && audio) {
        playAudio();
      }
    };

    return (
      <Wrapper>
        <TimerSet
          initialTime={initialTime}
          isActive={isActive}
          setTitleTime={setTitleTime}
          onTimeEnd={onTimeEnd}
          restart={restart}
        />
        <SideMenu>
          <Header>Aika Timer</Header>
          {showAikaInfoText && (
            <>
              <SubHeader>What is Aika?</SubHeader>
              <Text>
                {
                  'Aika means "time" in Finnish. It\'s a distraction-free online timer with fullscreen countdowns, desktop notifications, and customizable timer sequences. Perfect for Pomodoro productivity, time-boxed meetings, and the 20-20-20 eye care technique.'
                }
              </Text>
            </>
          )}
          <SubHeader>Settings</SubHeader>
          <Toggle isOn={playSound} setIsOn={handleSoundToggle}>
            Sound
          </Toggle>
          <NotificationToggle setNotify={(notify) => setNotify(() => notify)}>
            {(isDenied) => (
              <>
                Notifications{' '}
                {isDenied && (
                  <Tooltip>
                    {
                      "Can't enable notifications since they are disabled in the"
                    }
                    {' browser settings'}
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

TimerApp.displayName = 'TimerApp';

export default TimerApp;
