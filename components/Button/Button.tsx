import styled, { css } from 'styled-components';
import React from 'react';

export type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isHidden?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

const StyledButton = styled.button<{ $isHidden?: boolean }>`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.dark};
  border: 1px solid transparent;
  padding: 10px 20px;
  font-size: ${({ theme }) => theme.fontSizes.medium * 0.8}rem;
  font-weight: 100;
  border-radius: ${({ theme }) => theme.radius}rem;
  cursor: pointer;

  opacity: ${({ $isHidden }) => ($isHidden ? 0 : 1)};
  pointer-events: ${({ $isHidden }) => ($isHidden ? 'none' : 'auto')};

  transition: ${({ theme }) => theme.transition}s ease;

  &:hover:not(:disabled) {
    border: 1px solid ${({ theme }) => theme.colors.dark};
  }

  &:active:not(:disabled) {
    color: ${({ theme }) => theme.colors.highlight};
    border-color: ${({ theme }) => theme.colors.highlight};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = ({ children, isHidden, ...rest }: ButtonProps) => {
  return (
    <StyledButton $isHidden={isHidden} {...rest}>
      {children}
    </StyledButton>
  );
};

export default Button; 