import styled from 'styled-components';
import React from 'react';

export type Props = {
  children: React.ReactNode;
  isHidden?: boolean;
  ref?: React.RefObject<HTMLDivElement | null>;
} & React.ButtonHTMLAttributes<HTMLDivElement>;

const StyledDiv = styled.div<{ $isHidden?: boolean }>`
  opacity: ${({ $isHidden }) => ($isHidden ? 0 : 1)};
  pointer-events: ${({ $isHidden }) => ($isHidden ? 'none' : 'auto')};

  transition: ${({ theme }) => theme.transition}s ease;

  &:disabled {
    cursor: not-allowed;
  }
`;

// Component for hiding children wihtout removing them from DOM (preventing layout shift)
const Hidable = ({ children, isHidden, ...rest }: Props) => {
  return (
    <StyledDiv
      $isHidden={isHidden}
      tabIndex={isHidden ? -1 : undefined} // Hide children from tab navigation
      {...rest}
    >
      {children}
    </StyledDiv>
  );
};

export default Hidable;
