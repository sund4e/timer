import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import QuestionIcon from '../../icons/question';

const TooltipText = styled.div<{$parentPosition: DOMRect}>`
  background-color: ${({ theme }) => theme.colors.highlight};
  color: ${({ theme }) => theme.colors.light};
  position: absolute;
  top: ${({ $parentPosition }: { $parentPosition: DOMRect }) =>
    $parentPosition.top}px;
  left: ${({ $parentPosition }: { $parentPosition: DOMRect }) =>
    $parentPosition.right}px;
  padding: ${({ theme }) => theme.fontSizes.medium / 2}rem;
  font-size: ${({ theme }) => theme.fontSizes.small}rem;
  border-radius: 6px;
  boder-color: ${({ theme }) => theme.colors.primary};
  border_width: 5px;
`;

const TooltipIcon = styled.div`
  display: inline-block;
`;

type Props = {
  children: React.ReactNode;
};

const Tooltip = ({ children }: Props) => {
  const [show, setShow] = useState(false);
  const tooltipIcon = useRef<HTMLDivElement>(null);
  const portalRoot = useRef(document.createElement('div'));
  const [parentPosition, setParentPosition] = useState<DOMRect | undefined>(
    undefined
  );

  useEffect(() => {
    document.body.appendChild(portalRoot.current);
    return () => {
      document.body.removeChild(portalRoot.current);
    };
  }, []);

  return (
    <>
      <TooltipIcon
        ref={tooltipIcon}
        onMouseEnter={() => {
          setShow(true);
          setParentPosition(tooltipIcon.current?.getBoundingClientRect());
        }}
        onMouseLeave={() => {
          setShow(false);
        }}
      >
        <QuestionIcon />
      </TooltipIcon>
      {show &&
        parentPosition &&
        ReactDOM.createPortal(
          <TooltipText $parentPosition={parentPosition}>{children}</TooltipText>,
          portalRoot.current
        )}
    </>
  );
};

export default Tooltip;
