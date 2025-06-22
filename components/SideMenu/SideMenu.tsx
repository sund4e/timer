import styled from 'styled-components';
import { useState, MouseEvent as ReactMouseEvent } from 'react';
import SwitchButton from '../SwitchButton';
import { Theme } from '../../styles/theme';

const Menu = styled.div<{
  $isOpen: boolean;
  theme: Theme;
}>`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 300px;
  transition: transform 0.4s ease-in-out;
  transform: translateX(
    ${({ $isOpen }: { $isOpen: boolean }) => ($isOpen ? 0 : 100)}%
  );
  padding: ${({ theme }) => theme.fontSizes.medium}rem;
  padding-top: ${({ theme }) => theme.fontSizes.medium * 2}rem;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);
  color: ${({ theme }) => theme.colors.light};
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
      <Menu $isOpen={isOpen} className={className} onClick={onClickMenu}>
        {children}
      </Menu>
      <StyledButton isOpen={isOpen} onClick={onClickButton} />
    </>
  );
};

export default SideMenu;
