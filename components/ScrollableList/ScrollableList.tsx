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
import { throttle, debounce, clamp } from 'lodash';
import Hidable from '../Hidable/Hidable';

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

const ControlWrapper = styled(Hidable)`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 10px;
  margin-top: 1vh;
  position: sticky;
  bottom: 0;
`;

export type Props = {
  children: React.ReactElement[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  allowScrolling: boolean;
  controls: React.ReactNode;
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
      layout
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
    controls,
  }: Props) => {
    const itemRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
    const listRef = useRef<HTMLDivElement>(null);
    const automaticScrollIsRunning = useRef(false);
    const [fillerHeight, setFillerHeight] = useState(0);
    const fillerRef = useRef<HTMLDivElement>(null);
    const inactiveItemHeight = useRef(0);
    const selectedIndexRef = useRef(selectedIndex);

    useEffect(() => {
      selectedIndexRef.current = selectedIndex;
    }, [selectedIndex]);

    const { scrollY } = useScroll({
      container: listRef,
    });

    const getActiveIndex = useCallback(() => {
      if (
        !listRef.current ||
        itemRefs.current.length <= 1 ||
        !inactiveItemHeight.current
      ) {
        return 0;
      }
      const scrollPosition = listRef.current.scrollTop;
      const activeIndex = Math.round(
        scrollPosition / inactiveItemHeight.current
      );
      // On ios the scroll position may go a bit over or under the list boundaries
      const boundedIndex = clamp(activeIndex, 0, itemRefs.current.length - 1);
      return boundedIndex;
    }, []);

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

    const updateItemHeight = useCallback(() => {
      if (itemRefs.current.length > 1) {
        let inactiveItemIndex = selectedIndexRef.current === 0 ? 1 : 0;
        inactiveItemHeight.current =
          itemRefs.current[inactiveItemIndex]?.current?.getBoundingClientRect()
            .height || 0;
      }
    }, []);

    const updateFillerHeight = useCallback(() => {
      const scrollContainer = listRef.current;
      const selectedIndex = selectedIndexRef.current;
      if (fillerRef.current && scrollContainer) {
        setFillerHeight(
          fillerRef.current?.getBoundingClientRect().height -
            scrollContainer.scrollTop +
            selectedIndex * inactiveItemHeight.current
        );
      }
    }, []);

    useLayoutEffect(() => {
      if (!inactiveItemHeight.current) {
        updateItemHeight();
      }
    }, [updateItemHeight, children.length]);

    const debouncedScrollEnd = useMemo(
      () =>
        debounce(() => {
          automaticScrollIsRunning.current = false;
          if (!fillerHeight) {
            updateFillerHeight();
          }
        }, 500),
      [updateFillerHeight, fillerHeight]
    );

    const centerList = useCallback(() => {
      automaticScrollIsRunning.current = true;
      itemRefs.current[selectedIndexRef.current]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      debouncedScrollEnd();
    }, [debouncedScrollEnd]);

    const updateLayoutMeasures = useCallback(() => {
      console.log('updating layout measures');
      updateItemHeight();
      centerList();
    }, [updateItemHeight, centerList]);

    useLayoutEffect(() => {
      updateItemHeight(); // Initial calculation

      window.addEventListener('resize', updateLayoutMeasures);
      window.addEventListener('orientationchange', updateLayoutMeasures);

      return () => {
        window.removeEventListener('resize', updateLayoutMeasures);
        window.removeEventListener('orientationchange', updateLayoutMeasures);
      };
    }, [updateLayoutMeasures, updateItemHeight]);

    // Scroll to the active item when the selected index changes
    useEffect(() => {
      // Do not scroll if the active index is the same as the selected index (user is already scrolling)
      const activeIndex = getActiveIndex();
      if (activeIndex === selectedIndex) {
        return;
      }
      centerList();
    }, [selectedIndex, getActiveIndex, centerList]);

    return (
      <List
        ref={listRef}
        $allowScroll={allowScrolling && children.length > 1}
        data-testid="scrollable-list"
      >
        <Filler
          ref={fillerRef}
          style={fillerHeight ? { height: `${fillerHeight}px` } : {}}
          data-testid="filler"
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
        {<ControlWrapper isHidden={!allowScrolling}>{controls}</ControlWrapper>}
        <Filler style={fillerHeight ? { height: `${fillerHeight}px` } : {}} />
      </List>
    );
  }
);

ScrollableList.displayName = 'ScrollableList';

export default ScrollableList;
