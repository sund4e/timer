import styled from 'styled-components';
import { motion, HTMLMotionProps } from 'motion/react';
import React from 'react';
import { useTheme } from 'styled-components';
import tinycolor from 'tinycolor2';

const StyledButton = styled(motion.button)<{ $isHidden?: boolean }>`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.light};
  border: 1px solid transparent;
  padding: 10px 20px;
  font-size: ${({ theme }) => theme.fontSizes.medium * 0.8}rem;
  border-radius: ${({ theme }) => theme.radius}rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    border: 1px solid ${({ theme }) => theme.colors.light};
  }

  &:active:not(:disabled) {
    color: white;
    border-color: white;
  }

  &:focus {
    outline: none;
    border: 1px solid
      ${({ theme }) =>
        tinycolor(theme.colors.light).setAlpha(0.7).toRgbString()};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const Button = React.forwardRef<HTMLButtonElement, HTMLMotionProps<'button'>>(
  ({ children, ...rest }, ref) => {
    const theme = useTheme();
    return (
      <StyledButton
        ref={ref}
        transition={{
          duration: theme.transition,
          ease: 'easeOut',
          bounce: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        layout
        {...rest}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
