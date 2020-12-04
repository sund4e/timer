import styled from 'styled-components';
import Timer from '../Timer';
import NotificationToggle from '../NotificationToggle';
import Toggle from '../Toggle';
import { useState } from 'react';
import SideMenu from '../SideMenu';
import { Theme } from '../../styles/theme';

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

  function onTimeEnd() {
    if (notify) {
      notify();
    }
  }

  return (
    <Wrapper>
      <StyledTimer
        restart={restart}
        onTimeEnd={onTimeEnd}
        isActive={true}
        initialTime={1200}
        initialIsFocused={true}
      />
      <SideMenu>
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
