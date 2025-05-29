import { memo, useEffect, useRef, createRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';

const inactiveItemScale = 0.5;
const maxHeight = 25;

const TimersList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
`;

const Item = styled(motion.div)``;

export type Props = {
  children: React.ReactElement[];
  selectedIndex: number;
};

type AnimatedItemProps = {
  children: React.ReactElement;
  index: number;
  active: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
};

const AnimatedItem = ({
  children,
  active,
  ref,
  listRef,
}: AnimatedItemProps) => {
  const isInView = useInView(ref, { amount: 0.9, root: listRef });

  return (
    <Item
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isInView ? 1 : 0,
        scale: active ? 1 : inactiveItemScale,
        maxHeight: active
          ? `${maxHeight}%`
          : `${maxHeight * inactiveItemScale}%`,
      }}
      transition={{
        opacity: { duration: 0.3 },
      }}
    >
      {children}
    </Item>
  );
};

const TimerList = memo(({ children, selectedIndex }: Props) => {
  const timerRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>([]);
  const listRef = useRef<HTMLDivElement>(null);

  if (timerRefs.current.length !== children.length) {
    timerRefs.current = Array.from(
      { length: children.length },
      (_, i) => timerRefs.current[i] || createRef<HTMLDivElement | null>()
    );
  }

  useEffect(() => {
    if (
      timerRefs.current[selectedIndex] &&
      timerRefs.current[selectedIndex].current
    ) {
      timerRefs.current[selectedIndex].current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedIndex, children]);

  return (
    <TimersList ref={listRef}>
      {children.map((child, index) => (
        <AnimatedItem
          listRef={listRef}
          key={child.key}
          ref={timerRefs.current[index]}
          index={index}
          active={index === selectedIndex}
        >
          {child}
        </AnimatedItem>
      ))}
    </TimersList>
  );
});

TimerList.displayName = 'TimerList';

export default TimerList;
