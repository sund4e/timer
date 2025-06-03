import {
  memo,
  useEffect,
  useRef,
  createRef,
  useLayoutEffect,
  useState,
  useCallback,
  useMemo,
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

const List = styled.div<{ $allowScroll: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  overflow-y: ${({ $allowScroll }) => ($allowScroll ? 'scroll' : 'hidden')};
  width: 100%;
  height: 100%;

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
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
      data-testid={active ? 'active-timer' : ''}
    >
      {children}
    </Item>
  );
};

const ScrollableList = memo(
  ({
    children,
    selectedIndex,
    onSelectedIndexChange,
    allowScrolling,
  }: Props) => {
    const itemRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
    const listRef = useRef<HTMLDivElement>(null);
    const automaticScrollIsRunning = useRef(false);
    const listCenterY = useRef(0);
    const [fillerHeight, setFillerHeight] = useState(0);
    const fillerRef = useRef<HTMLDivElement>(null);
    const inactiveItemHeight = useRef(0);
    const activeItemHeight = useRef(0);

    const { scrollY } = useScroll({
      container: listRef,
    });

    const getActiveIndex = useCallback(() => {
      if (!listRef.current) {
        return 0;
      }
      const scrollPosition = listRef.current.scrollTop;
      return Math.round(scrollPosition / inactiveItemHeight.current);
    }, []);

    useEffect(() => {
      const scrollContainer = listRef.current;
      const handleScrollEnd = () => {
        automaticScrollIsRunning.current = false;
        // Adjust filler height after first scroll so that active timer is centered
        if (!fillerHeight && fillerRef.current && scrollContainer) {
          setFillerHeight(
            fillerRef.current?.getBoundingClientRect().height -
              scrollContainer.scrollTop
          );
        }
      };

      scrollContainer?.addEventListener('scrollend', handleScrollEnd);

      return () => {
        scrollContainer?.removeEventListener('scrollend', handleScrollEnd);
      };
    }, [fillerHeight]);

    const scrollLogic = useCallback(() => {
      if (!listRef.current) {
        return;
      }

      const index = getActiveIndex();

      if (index !== selectedIndex) {
        onSelectedIndexChange(index);
      }
    }, [selectedIndex, onSelectedIndexChange, getActiveIndex]);

    const handleScroll = useMemo(
      () => throttle(scrollLogic, 150),
      [scrollLogic]
    );

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

    useLayoutEffect(() => {
      if (
        itemRefs.current.length > 1 &&
        !activeItemHeight.current &&
        !inactiveItemHeight.current
      ) {
        let inactiveItemIndex = selectedIndex === 0 ? 1 : 0;
        activeItemHeight.current =
          itemRefs.current[selectedIndex]?.current?.getBoundingClientRect()
            .height || 0;
        inactiveItemHeight.current =
          itemRefs.current[inactiveItemIndex]?.current?.getBoundingClientRect()
            .height || 0;
      }
    }, [selectedIndex, children, fillerHeight]);

    // Scroll to the active item when the selected index changes
    useEffect(() => {
      const activeIndex = getActiveIndex();
      if (activeIndex === selectedIndex) {
        return;
      }
      automaticScrollIsRunning.current = true;
      itemRefs.current[selectedIndex]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, [selectedIndex, children, fillerHeight, getActiveIndex]);

    return (
      <List ref={listRef} $allowScroll={allowScrolling}>
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
      </List>
    );
  }
);

ScrollableList.displayName = 'ScrollableList';

export default ScrollableList;
