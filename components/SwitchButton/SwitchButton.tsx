import styled from 'styled-components';
import { MouseEvent as ReactMouseEvent } from 'react';

const StyledButton = styled.button<{
  $isOpen: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: ${({ theme }) => theme.fontSizes.medium}rem;
  height: ${({ theme }) => theme.fontSizes.medium}rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  &:focus {
    outline: none;
  }

  div {
    width: ${({ theme }) => theme.fontSizes.medium}rem;
    height: 5px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ $isOpen }) => ($isOpen ? 'rotate(45deg)' : 'rotate(0)')};
    }

    :nth-child(2) {
      opacity: ${({ $isOpen }) => ($isOpen ? '0' : '1')};
    }

    :nth-child(3) {
      transform: ${({ $isOpen }: { $isOpen: boolean }) =>
        $isOpen ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

const SwitchButton = ({
  isOpen,
  onClick,
  className,
}: {
  isOpen: boolean;
  onClick: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}) => (
  <StyledButton className={className} $isOpen={isOpen} onClick={onClick}>
    <div />
    <div />
    <div />
  </StyledButton>
);

export default SwitchButton;
