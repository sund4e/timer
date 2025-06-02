import {
  memo,
  useEffect,
  useRef,
  createRef,
  useLayoutEffect,
  useState,
  useCallback,
} from 'react';
import styled from 'styled-components';
import {
  motion,
  useInView,
  useScroll,
  useMotionValueEvent,
} from 'motion/react';
import { throttle, DebouncedFunc } from 'lodash';

const activeItemScale = 1.75;

const TimersList = styled.div<{ $allowScroll: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  overflow-y: ${({ $allowScroll }) => ($allowScroll ? 'scroll' : 'hidden')};
  width: 100%;
  height: 100%;
`;

// Set initial height to 50% of the list height, corrected after first render
const Filler = styled.div`
  height: 50%;
  flex-shrink: 0;
`;

const Item = styled(motion.div)`
  margin: 0;
`;

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
        scale: active ? activeItemScale : 1,
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

const TimerList = memo(
  ({
    children,
    selectedIndex,
    onSelectedIndexChange,
    allowScrolling,
  }: Props) => {
    const itemRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
    const listRef = useRef<HTMLDivElement>(null);
    const userIsManuallyScrolling = useRef(false);
    const automaticScrollIsRunning = useRef(false);
    const listCenterY = useRef(0);
    const [fillerHeight, setFillerHeight] = useState(0);
    const fillerRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll({
      container: listRef,
    });

    useEffect(() => {
      const scrollContainer = listRef.current;
      const handleScrollEnd = () => {
        userIsManuallyScrolling.current = false;

        // Adjust filler height after first scroll so that active timer is centered
        if (!fillerHeight && fillerRef.current && listRef.current) {
          setFillerHeight(
            fillerRef.current?.getBoundingClientRect().height -
              listRef.current.scrollTop
          );
        }
      };

      scrollContainer?.addEventListener('scrollend', handleScrollEnd);

      return () => {
        scrollContainer?.removeEventListener('scrollend', handleScrollEnd);
      };
    }, [fillerHeight]);

    const handleScroll = throttle(() => {
      userIsManuallyScrolling.current = true;

      const index = itemRefs.current.findIndex((item) => {
        return (
          item.current.getBoundingClientRect().top <= listCenterY.current &&
          item.current.getBoundingClientRect().bottom >= listCenterY.current
        );
      });

      if (index !== selectedIndex) {
        onSelectedIndexChange(index);
      }
    }, 100);

    useMotionValueEvent(scrollY, 'change', () => {
      if (!automaticScrollIsRunning.current) {
        handleScroll();
      }
    });

    if (itemRefs.current.length !== children.length) {
      itemRefs.current = Array.from(
        { length: children.length },
        (_, i) => itemRefs.current[i] || createRef<HTMLDivElement | null>()
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateListCenter = useCallback(
      throttle(() => {
        if (listRef.current) {
          const rect = listRef.current.getBoundingClientRect();
          listCenterY.current = rect.top + rect.height / 2;
        }
      }, 100),

      []
    ) as DebouncedFunc<() => void>;

    useLayoutEffect(() => {
      updateListCenter(); // Initial calculation

      window.addEventListener('resize', updateListCenter);
      window.addEventListener('orientationchange', updateListCenter);

      return () => {
        window.removeEventListener('resize', updateListCenter);
        window.removeEventListener('orientationchange', updateListCenter);
        updateListCenter.cancel();
      };
    }, [updateListCenter]);

    useEffect(() => {
      const selectedItem = itemRefs.current[selectedIndex]?.current;
      if (!listRef.current || !itemRefs.current || !selectedItem) {
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
        const timeout = setTimeout(() => {
          automaticScrollIsRunning.current = false;
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }, [selectedIndex, children, fillerHeight]);

    return (
      <TimersList ref={listRef} $allowScroll={allowScrolling}>
        <Filler
          ref={fillerRef}
          style={fillerHeight ? { height: `${fillerHeight}px` } : {}}
        />
        {children.map((child, index) => (
          <AnimatedItem
            listRef={listRef}
            key={child.key}
            ref={itemRefs.current[index]}
            index={index}
            active={index === selectedIndex}
          >
            {child}
          </AnimatedItem>
        ))}
        <Filler style={fillerHeight ? { height: `${fillerHeight}px` } : {}} />
      </TimersList>
    );
  }
);

TimerList.displayName = 'TimerList';

export default TimerList;
