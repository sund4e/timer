import {
  memo,
  useEffect,
  useRef,
  createRef,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
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

export const activeItemScale = 2;

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
  font-size: 10vmin;
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
export interface ChildWithKey extends Omit<React.ReactElement, 'key'> {
  key: string;
}

export type Props = {
  children: ChildWithKey[];
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
  index,
  ...rest
}: AnimatedItemProps) => {
  const isInView = useInView(ref, { amount: 0.9, root: listRef });

  return (
    <Item
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isInView ? (active ? 1 : 0.5) : 0,
        scale: active ? activeItemScale : 1,
        margin: active ? `0.5em` : 0,
        ...(index === 0 ? { marginTop: 0 } : {}),
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
    const itemRefs = useRef(
      new Map<
        string,
        { element: React.RefObject<HTMLDivElement | null>; index: number }
      >()
    );
    const listRef = useRef<HTMLDivElement>(null);
    const automaticScrollIsRunning = useRef(false);
    const [fillerHeight, setFillerHeight] = useState(0);
    const [bottomFillerHeight, setBottomFillerHeight] = useState(0);
    const fillerRef = useRef<HTMLDivElement>(null);
    const controWrapperRef = useRef<HTMLDivElement>(null);
    const selectedItemKey = useRef('');

    const getRef = (
      key: string,
      index: number
    ): React.RefObject<HTMLDivElement | null> => {
      const existingRef = itemRefs.current.get(key);
      itemRefs.current.set(key, {
        element: existingRef
          ? existingRef.element
          : createRef<HTMLDivElement>(),
        index,
      });
      return itemRefs.current.get(key)!.element;
    };

    const updateLayoutHeights = useCallback(() => {
      const scrollContainer = listRef.current;
      if (fillerRef.current && scrollContainer) {
        const activeItemHeight =
          itemRefs.current.get(selectedItemKey.current)?.element.current
            ?.clientHeight || 0;
        const containerCenter = scrollContainer.clientHeight / 2;
        const topFillerHeight = containerCenter - activeItemHeight;
        setFillerHeight(topFillerHeight);
        setBottomFillerHeight(
          topFillerHeight - (controWrapperRef.current?.clientHeight || 0)
        );
      }
    }, []);

    useEffect(() => {
      const listElement = listRef.current;
      if (!listElement) return;

      const observer = new ResizeObserver(() => {
        updateLayoutHeights();
      });
      observer.observe(listElement);

      return () => {
        observer.unobserve(listElement);
      };
    }, [updateLayoutHeights]);

    useEffect(() => {
      selectedItemKey.current = children[selectedIndex].key;
    }, [selectedIndex, children]);

    const { scrollY } = useScroll({
      container: listRef,
    });

    const getActiveIndex = useCallback(() => {
      if (
        !listRef.current ||
        itemRefs.current.size <= 1 ||
        !fillerRef.current
      ) {
        return 0;
      }
      const viewportCenter =
        listRef.current.scrollTop + listRef.current.clientHeight / 2;

      let closestItemIndex = 0;
      let smallestDistance = Infinity;

      itemRefs.current.forEach((itemRef) => {
        const itemElement = itemRef.element.current;
        if (!itemElement) return;

        const itemCenter = itemElement.offsetTop + itemElement.offsetHeight / 2;
        const distance = Math.abs(viewportCenter - itemCenter);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestItemIndex = itemRef.index;
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

    const debouncedScrollEnd = useMemo(
      () =>
        debounce(() => {
          automaticScrollIsRunning.current = false;
        }, 500),
      []
    );

    const centerList = useCallback(() => {
      automaticScrollIsRunning.current = true;
      const element = itemRefs.current.get(selectedItemKey.current)?.element
        .current;

      if (element) {
        // Defer the scroll until the browser is ready for the next paint.
        // This ensures all layout calculations from the completed animation
        // have been processed.
        requestAnimationFrame(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        });
      }
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

    useLayoutEffect(() => {
      updateLayoutHeights();
    }, [selectedIndex, children.length, updateLayoutHeights]);

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
            ref={getRef(child.key, index)}
            index={index}
            active={index === selectedIndex}
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
