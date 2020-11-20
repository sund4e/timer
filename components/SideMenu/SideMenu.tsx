import styled from 'styled-components';
import { useState } from 'react';
import SwitchButton from '../SwitchButton';

const Menu = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  transition: transform 0.4s ease-in-out;
  transform: translateX(
    ${({ isOpen }: { isOpen: boolean }) => (isOpen ? 0 : 100)}%
  );
  padding: ${({ theme }) => theme.fontSizes.medium}rem;
  padding-top: ${({ theme }) => theme.fontSizes.medium * 2}rem;
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
  position: fixed;
  right: 0px;
`;

export type Props = {
  children: React.ReactNode;
  className?: string;
};

const SideMenu = ({ children, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Menu isOpen={isOpen} className={className}>
        {children}
      </Menu>
      <StyledButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </>
  );
};

export default SideMenu;
