import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: ${({ theme }) => theme.fontSizes.medium}rem;
  height: ${({ theme }) => theme.fontSizes.medium}rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;

  &:focus {
    outline: none;
  }

  div {
    width: ${({ theme }) => theme.fontSizes.medium}rem;
    border-bottom: 2px solid ${({ theme }) => theme.colors.highlight};
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
    }

    :nth-child(2) {
      opacity: ${({ open }) => (open ? '0' : '1')};
      transform: ${({ open }) => (open ? 'translateX(20px)' : 'translateX(0)')};
    }

    :nth-child(3) {
      transform: ${({ open }: { open: boolean }) =>
        open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

const SwitchButton = ({
  isOpen,
  onClick,
  className,
}: {
  isOpen: boolean;
  onClick: () => void;
  className: string;
}) => (
  <StyledButton className={className} open={isOpen} onClick={onClick}>
    <div />
    <div />
    <div />
  </StyledButton>
);

export default SwitchButton;
