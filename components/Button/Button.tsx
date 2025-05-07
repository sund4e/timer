import styled from 'styled-components';

export type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const StyledButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.dark};
  border: 1px solid transparent;
  padding: 10px 20px;
  font-size: ${({ theme }) => theme.fontSizes.medium * 0.8}rem;
  font-weight: 100;
  border-radius: ${({ theme }) => theme.radius}rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition}s ease;

  &:hover:not(:disabled) {
    border: 1px solid ${({ theme }) => theme.colors.dark};
  }

  &:active:not(:disabled) {
    color: ${({ theme }) => theme.colors.light};
    border-color: ${({ theme }) => theme.colors.light};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = ({ onClick, children, className, disabled }: ButtonProps) => {
  return (
    <StyledButton onClick={onClick} className={className} disabled={disabled}>
      {children}
    </StyledButton>
  );
};

export default Button; 