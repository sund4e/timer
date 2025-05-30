import { memo, useEffect, useRef, createRef } from 'react';
import styled from 'styled-components';
import {
  motion,
  useInView,
  useScroll,
  useMotionValueEvent,
} from 'motion/react';
import { throttle } from 'lodash';

const inactiveItemScale = 0.5;
const maxHeight = 25;
const fillerHeightPercentage = 50 - maxHeight / 2;

const TimersList = styled.div<{ $allowScroll: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  overflow-y: ${({ $allowScroll }) => ($allowScroll ? 'scroll' : 'hidden')};
  width: 100%;
  height: 100%;
`;

const Filler = styled.div`
  height: ${fillerHeightPercentage}%;
  flex-shrink: 0;
`;

const Item = styled(motion.div)``;

export type Props = {
  children: React.ReactElement[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  allowScrolling: boolean;
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
        scale: { duration: 0.3 },
        maxHeight: { duration: 0.3 },
      }}
    >
      {children}
    </Item>
  );
};

const findMiddleItem = (list: HTMLDivElement, items: HTMLDivElement[]) => {
  const listRect = list.getBoundingClientRect();
  const listCenterY = listRect.top + listRect.height / 2;

  let closestItemIndex = -1;
  let minDistance = Infinity;

  items.forEach((item, index) => {
    const itemRect = item.getBoundingClientRect();

    //Check if item is even visible within the scrollport to avoid unnecessary calculations
    if (
      itemRect.height === 0 ||
      itemRect.width === 0 ||
      itemRect.bottom < listRect.top ||
      itemRect.top > listRect.bottom
    ) {
      return;
    }

    const itemCenterY = itemRect.top + itemRect.height / 2;
    const distance = Math.abs(listCenterY - itemCenterY);

    if (distance < minDistance) {
      minDistance = distance;
      closestItemIndex = index;
    }
  });

  return closestItemIndex;
};

const TimerList = memo(
  ({
    children,
    selectedIndex,
    onSelectedIndexChange,
    allowScrolling,
  }: Props) => {
    const timerRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
    const listRef = useRef<HTMLDivElement>(null);
    const userIsManuallyScrolling = useRef(false);
    const automaticScrollIsRunning = useRef(false);

    const { scrollY } = useScroll({
      container: listRef,
    });

    useEffect(() => {
      const scrollContainer = listRef.current;
      const handleScrollEnd = () => {
        userIsManuallyScrolling.current = false;
        automaticScrollIsRunning.current = false;
      };

      scrollContainer?.addEventListener('scrollend', handleScrollEnd);

      return () => {
        scrollContainer?.removeEventListener('scrollend', handleScrollEnd);
      };
    }, []);

    const handleScroll = throttle((latest: number) => {
      userIsManuallyScrolling.current = true;
      onSelectedIndexChange(Math.round(latest / (maxHeight * 2)));
    }, 100);

    useMotionValueEvent(scrollY, 'change', (latest) => {
      if (!automaticScrollIsRunning.current) {
        handleScroll(latest);
      }
      // handleScroll(latest);
    });

    if (timerRefs.current.length !== children.length) {
      timerRefs.current = Array.from(
        { length: children.length },
        (_, i) => timerRefs.current[i] || createRef<HTMLDivElement | null>()
      );
    }

    useEffect(() => {
      const selectedItem = timerRefs.current[selectedIndex]?.current;
      if (!listRef.current || !timerRefs.current || !selectedItem) {
        return;
      }

      const middleItem = findMiddleItem(
        listRef.current,
        timerRefs.current.map((ref) => ref.current)
      );

      if (middleItem === selectedIndex) {
        userIsManuallyScrolling.current = false;
        return;
      }

      if (userIsManuallyScrolling.current) {
        // Scroll was triggered by the user, so we don't need to scroll again
        return;
      }

      if (selectedItem) {
        automaticScrollIsRunning.current = true;
        selectedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, [selectedIndex, children]);

    return (
      <TimersList ref={listRef} $allowScroll={allowScrolling}>
        <Filler />
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
        <Filler />
      </TimersList>
    );
  }
);

TimerList.displayName = 'TimerList';

export default TimerList;
