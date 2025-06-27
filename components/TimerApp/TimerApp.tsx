import styled from 'styled-components';
import Toggle from '../Toggle';
import { memo, useState, useEffect } from 'react';
import SideMenu from '../SideMenu';
import TimerSet from '../TimerSet/TimerSet';
import useStorage from '../../hooks/useStorage/useStorage';
import { useNotification } from '../../hooks/useNotification/useNotification';
import Tooltip from '../Tooltip';
import { Box } from '../Box/Box';

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

const MenuSection = styled(Box)`
  width: 300px;
  flex-direction: column;
  flex-wrap: no-wrap;
`;

export type Props = {
  initialTime: number;
  isActive: boolean;
  setTitleTime: (seconds: number) => void;
};

type AppConfig = {
  notify: boolean;
  restart: boolean;
  playSound: boolean;
};

const TimerApp = memo(
  ({ initialTime = 0, isActive = true, setTitleTime }: Props) => {
    const [notify, setNotify] = useState(false);
    const [restart, setRestart] = useState(false);
    const [playSound, setPlaySound] = useState(true);

    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isLikelyMobile, setIsLikelyMobile] = useState(false);
    const [notificationsDenied, setNotificationsDenied] = useState(false);
    const { showNotification, requestNotificationPermission } =
      useNotification();

    const { getSavedItem: getSavedAppConfig, setSavedItem: setSavedAppConfig } =
      useStorage<AppConfig>('appConfig');

    useEffect(() => {
      const savedConfig = getSavedAppConfig();
      if (savedConfig) {
        setNotify(!!savedConfig.notify);
        setRestart(!!savedConfig.restart);
        setPlaySound(!!savedConfig.playSound);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      setSavedAppConfig({ notify, restart, playSound });
    }, [notify, restart, playSound, setSavedAppConfig]);

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
        showNotification();
      }
    }

    const handleSoundToggle = (newValue: boolean) => {
      setPlaySound(newValue);
      if (newValue && isLikelyMobile && audio) {
        playAudio();
      }
    };

    const handleNotificationToggle = async (newValue: boolean) => {
      const notificationPermissionGranted =
        await requestNotificationPermission();
      if (notificationPermissionGranted && newValue) {
        setNotify(true);
      } else {
        if (!notificationPermissionGranted) {
          setNotificationsDenied(true);
        }
        setNotify(false);
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
          <MenuSection className="aika-info">
            <SubHeader>What is Aika?</SubHeader>
            <Text>
              {
                'Aika means "time" in Finnish. It\'s a distraction-free online timer with fullscreen countdowns, desktop notifications, and customizable timer sequences. Perfect for Pomodoro productivity, time-boxed meetings, and the 20-20-20 eye care technique.'
              }
            </Text>
          </MenuSection>
          <MenuSection>
            <SubHeader>Settings</SubHeader>
            <Toggle isOn={playSound} setIsOn={handleSoundToggle}>
              Sound
            </Toggle>
            <Toggle isOn={notify} setIsOn={handleNotificationToggle}>
              Notifications{' '}
              {notificationsDenied && (
                <Tooltip>
                  {"Can't enable notifications since they are disabled in the"}
                  {' browser settings'}
                </Tooltip>
              )}
            </Toggle>
            <Toggle isOn={restart} setIsOn={setRestart}>
              Restart timer when done
            </Toggle>
          </MenuSection>
        </SideMenu>
      </Wrapper>
    );
  }
);

TimerApp.displayName = 'TimerApp';

export default TimerApp;
