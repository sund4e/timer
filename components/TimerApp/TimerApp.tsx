import { FiSettings } from 'react-icons/fi';
import styled from 'styled-components';
import Timer from '../Timer';
import NotificationToggle from '../NotificationToggle';
import Toggle from '../Toggle';
import { useState } from 'react';
import SwitchButton from '../SwitchButton';

const settingsBarHeight = '30vh';

const Settings = styled.div`
  height: ${settingsBarHeight};
  transition: transform 0.3s ease-in-out;
  transform: translateY(
    ${({ isOpen }: { isOpen: boolean }) => (isOpen ? 0 : 75)}%
  );
  display: flex;
  flex-direction: column;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    background-color: ${({ theme }) => theme.colors.light};
    z-index: -1;
  }
`;

const StyledButton = styled(SwitchButton)`
  margin: 10px;
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
  const [settingsOpen, setSettingsOpen] = useState(false);

  function onTimeEnd() {
    if (notify) {
      notify();
    }
  }

  return (
    <Wrapper>
      <Timer
        restart={restart}
        onTimeEnd={onTimeEnd}
        isActive={true}
        initialTime={1200}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
      />
      <div>
        <Settings isOpen={settingsOpen}>
          <StyledButton
            isOpen={settingsOpen}
            onClick={() => setSettingsOpen(!settingsOpen)}
          />
          <div>
            <NotificationToggle
              setNotify={(notify) => setNotify(() => notify)}
              initialShow={true}
            />
            <Toggle
              isOn={restart}
              setIsOn={setRestart}
              label={'Restart timer when done'}
            />
          </div>
        </Settings>
      </div>
    </Wrapper>
  );
};

export default TimerApp;
