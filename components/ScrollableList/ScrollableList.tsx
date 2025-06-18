import {
  memo,
  useEffect,
  useRef,
  createRef,
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
  MotionProps,
} from 'motion/react';
import { throttle, debounce } from 'lodash';
import Hidable from '../Hidable/Hidable';

export const activeItemScale = 1.75;

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
} & MotionProps;

const AnimatedItem = ({
  children,
  active,
  ref,
  listRef,
  ...rest
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
      data-testid={active ? 'active-list-item' : 'list-item'}
      {...rest}
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
    const [bottomFillerHeight, setBottomFillerHeight] = useState(0);
    const fillerRef = useRef<HTMLDivElement>(null);
    const controWrapperRef = useRef<HTMLDivElement>(null);
    const inactiveItemHeight = useRef(0);
    const activeItemHeight = useRef(0);
    const selectedIndexRef = useRef(selectedIndex);
    const recalculateLayoutHeights = useRef(false);

    useEffect(() => {
      const listElement = listRef.current;
      if (!listElement) return;

      const observer = new ResizeObserver(() => {
        recalculateLayoutHeights.current = true;
      });
      observer.observe(listElement);

      return () => {
        observer.unobserve(listElement);
      };
    }, []);

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
        !fillerRef.current
      ) {
        return selectedIndexRef.current;
      }
      const viewportCenter =
        listRef.current.scrollTop + listRef.current.clientHeight / 2;

      let closestItemIndex = 0;
      let smallestDistance = Infinity;

      itemRefs.current.forEach((itemRef, index) => {
        const itemElement = itemRef.current;
        if (!itemElement) return;

        const itemCenter = itemElement.offsetTop + itemElement.offsetHeight / 2;
        const distance = Math.abs(viewportCenter - itemCenter);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestItemIndex = index;
        }
      });

      return closestItemIndex;
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

    const updateLayoutHeights = useCallback(() => {
      if (!recalculateLayoutHeights.current) {
        return;
      }

      const scrollContainer = listRef.current;
      if (fillerRef.current && scrollContainer) {
        activeItemHeight.current =
          itemRefs.current[
            selectedIndexRef.current
          ]?.current?.getBoundingClientRect().height;
        inactiveItemHeight.current = activeItemHeight.current / activeItemScale;

        const containerCenter =
          scrollContainer.getBoundingClientRect().height / 2;
        const topFillerHeight =
          containerCenter - inactiveItemHeight.current / 2;
        setFillerHeight(topFillerHeight);
        setBottomFillerHeight(
          topFillerHeight -
            (controWrapperRef.current?.getBoundingClientRect().height || 0)
        );

        recalculateLayoutHeights.current = false;
      }
    }, []);

    const debouncedScrollEnd = useMemo(
      () =>
        debounce(() => {
          automaticScrollIsRunning.current = false;
        }, 500),
      []
    );

    const centerList = useCallback(() => {
      automaticScrollIsRunning.current = true;
      itemRefs.current[selectedIndexRef.current]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      debouncedScrollEnd();
    }, [debouncedScrollEnd]);

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
            onAnimationComplete={updateLayoutHeights}
          >
            {child}
          </AnimatedItem>
        ))}
        {
          <ControlWrapper ref={controWrapperRef} isHidden={!allowScrolling}>
            {controls}
          </ControlWrapper>
        }
        <Filler
          style={
            bottomFillerHeight ? { height: `${bottomFillerHeight}px` } : {}
          }
        />
      </List>
    );
  }
);

ScrollableList.displayName = 'ScrollableList';

export default ScrollableList;
