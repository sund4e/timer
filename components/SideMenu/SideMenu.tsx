import styled from 'styled-components';
import { useState, MouseEvent as ReactMouseEvent } from 'react';
import SwitchButton from '../SwitchButton';
import { Theme } from '../../styles/theme';
import { Box } from '../Box/Box';
import { motion } from 'motion/react';

const Header = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.medium}rem;
  margin: ${({ theme }) => theme.fontSizes.medium / 5}rem;
`;

const MenuContent = styled(Box)`
  @media (max-height: 400px) {
    flex-wrap: nowrap;
    flex-direction: row;
  }
`;

const Menu = styled(motion.div)<{
  $isOpen: boolean;
  theme: Theme;
}>`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 350px;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.fontSizes.medium}rem;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);
  color: ${({ theme }) => theme.colors.light};

  @media (max-height: 500px) {
    width: 90%;
    align-items: flex-start;
  }

  @media (max-height: 400px) and (max-width: 800px) {
    .aika-info {
      display: none;
    }
  }

  &:before {
    opacity: 0.8;
    background-color: ${({ theme }) => theme.colors.primary};
    border-left: 0.5px solid ${({ theme }) => theme.colors.primary};
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

const StyledButton = styled(SwitchButton)`
  margin: 20px;
  position: absolute;
  right: 1rem;
  top: 1rem;
`;

export type Props = {
  children: React.ReactNode;
  className?: string;
};

const SideMenu = ({ children, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickButton = (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const onClickMenu = (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <>
      <Menu
        $isOpen={isOpen}
        className={className}
        onClick={onClickMenu}
        initial={false}
        animate={{ translateX: isOpen ? 0 : '100%' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <Header>Aika Timer</Header>
        <MenuContent>{children}</MenuContent>
      </Menu>
      <StyledButton isOpen={isOpen} onClick={onClickButton} />
    </>
  );
};

export default SideMenu;
