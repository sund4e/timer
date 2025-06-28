import styled from 'styled-components';
import { MouseEvent as ReactMouseEvent } from 'react';
import { motion } from 'motion/react';

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

  &:focus {
    outline: none;
  }
`;

const Bar = styled(motion.div)`
  width: ${({ theme }) => theme.fontSizes.medium}rem;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 10px;
  position: relative;
  transform-origin: 1px;
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
  <StyledButton className={className} onClick={onClick}>
    <Bar
      animate={{ rotate: isOpen ? 45 : 0 }}
      transition={{ duration: 0.3, ease: 'linear' }}
    />
    <Bar
      animate={{ opacity: isOpen ? 0 : 1 }}
      transition={{ duration: 0.3, ease: 'linear' }}
    />
    <Bar
      animate={{ rotate: isOpen ? -45 : 0 }}
      transition={{ duration: 0.3, ease: 'linear' }}
    />
  </StyledButton>
);

export default SwitchButton;
