import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScrollableList, {
  activeItemScale,
  Props as ScrollableListProps,
} from './ScrollableList';
import {
  mockIntersectionObserver,
  restoreIntersectionObserver,
} from '../../tests/interserctionObserverMock'; // Assuming path
import React from 'react'; // Standard React import for types and potentially JSX

const itemHeight = 50;
const activeItemHeight = itemHeight * activeItemScale;
const fillerInitialHeight = 100;
const containerHeight = 500;
const mockGetBoundingClientRect = jest.fn(function (this: HTMLElement) {
  const testId = this.getAttribute('data-testid');
  switch (testId) {
    case 'scrollable-list':
      return { height: containerHeight } as DOMRect;
    case 'filler':
      return { height: fillerInitialHeight } as DOMRect;
    case 'active-list-item':
      return { height: activeItemHeight } as DOMRect;
    default:
      return { height: itemHeight } as DOMRect;
  }
});
const scrollIntoView = jest.fn();
const mockScrollYGet = jest.fn();
let motionValueEventCallback: ((latest: number) => void) | null = null;
let resizeObserverCallback: ResizeObserverCallback;
let onAnimationCompleteCallback: (() => void) | null = null;
let clientHeightSpy: jest.SpyInstance;

const scroll = (scrollPostion: number) => {
  if (motionValueEventCallback) {
    screen.getByTestId('scrollable-list').scrollTop = scrollPostion;
    motionValueEventCallback(scrollPostion); // Simulate scrollY changing to 50
    act(() => {
      jest.runAllTimers(); // Advance timers for the throttle in handleScroll
    });
  } else {
    throw new Error('motionValueEventCallback was not captured by the mock');
  }
};

const completeAnimation = () => {
  const callback = onAnimationCompleteCallback;
  if (callback) {
    act(() => {
      callback();
    });
  }
};

jest.mock('motion/react', () => {
  const originalMotion = jest.requireActual('motion/react');
  return {
    ...originalMotion,
    useScroll: jest.fn(() => ({
      scrollY: {
        get: mockScrollYGet,
        set: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
      },
    })),
    useMotionValueEvent: jest.fn((_, __, callback) => {
      motionValueEventCallback = callback;
      return () => {
        motionValueEventCallback = null;
      };
    }),
    motion: {
      ...originalMotion.motion,
      div: jest.fn(({ onAnimationComplete, ...props }) => {
        onAnimationCompleteCallback = onAnimationComplete;
        return <originalMotion.motion.div {...props} />;
      }),
    },
  };
});

const timers = [1, 2, 3, 4].map((i) => ({
  text: `Timer ${i}`,
  dataTestId: `timer-${i}`,
}));

const renderScrollableList = (overrides?: Partial<ScrollableListProps>) => {
  const defaultChildren = timers.map((timer, index) => (
    <div key={index} data-testid={timer.dataTestId}>
      {timer.text}
    </div>
  ));

  const props = {
    selectedIndex: 0,
    onSelectedIndexChange: jest.fn(),
    allowScrolling: true,
    controls: null,
    children: defaultChildren,
    ...(overrides ? overrides : {}),
  };

  clientHeightSpy.mockImplementation(function (this: HTMLElement) {
    if (this.matches('[data-testid="scrollable-list"]')) {
      return containerHeight;
    }
    if (this.matches('[data-testid="filler"]')) {
      return fillerInitialHeight;
    }
    if (this.matches('[data-testid="active-list-item"]')) {
      return activeItemHeight;
    }
    if (this.matches('[data-testid="list-item"]')) {
      return itemHeight;
    }
    return 0;
  });

  const rendered = render(<ScrollableList {...props} />);

  if (resizeObserverCallback) {
    act(() => {
      resizeObserverCallback([], {} as ResizeObserver);
    });
  }

  completeAnimation();

  act(() => {
    jest.runAllTimers(); // trigger debounce
  });

  return {
    ...rendered,
    rerender: (newProps?: Partial<ScrollableListProps>) =>
      rendered.rerender(<ScrollableList {...props} {...newProps} />),
  };
};

const getTimer = (index: number) => {
  return screen.getByTestId(timers[index].dataTestId);
};

describe('ScrollableList', () => {
  const originalScrollIntoView = Element.prototype.scrollIntoView;

  beforeEach(() => {
    jest.useFakeTimers();
    mockIntersectionObserver();
    Element.prototype.scrollIntoView = scrollIntoView;
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect; // Global mock for all elements
    clientHeightSpy = jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get');
    global.ResizeObserver = jest.fn((callback) => {
      resizeObserverCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    restoreIntersectionObserver();
    if (originalScrollIntoView) {
      Element.prototype.scrollIntoView = originalScrollIntoView;
    } else {
      delete (Element.prototype as any).scrollIntoView;
    }
    delete (Element.prototype as any).getBoundingClientRect;
    clientHeightSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('renders its children', () => {
    renderScrollableList();
    expect(screen.getByText('Timer 1')).toBeInTheDocument();
    expect(screen.getByText('Timer 2')).toBeInTheDocument();
    expect(screen.getByText('Timer 3')).toBeInTheDocument();
  });

  it('applies active-timer data-testid to the selected item', () => {
    renderScrollableList({ selectedIndex: 1 });
    const activeItemTestId = 'active-list-item';
    const activeTimerParent = screen
      .getByText('Timer 2')
      .closest(`[data-testid="${activeItemTestId}"]`);
    expect(activeTimerParent).toBeInTheDocument();
    expect(
      screen.getByText('Timer 1').closest(`[data-testid="${activeItemTestId}"]`)
    ).toBeNull();
  });

  it('does not scroll if only one item', () => {
    renderScrollableList({
      children: [
        <div key={1} data-testid={'timer'}>
          Timer
        </div>,
      ],
    });
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('centers selected item', () => {
    renderScrollableList({ selectedIndex: 1 });
    const expectedElement = getTimer(1);

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.calls[0]).toStrictEqual([
      { behavior: 'smooth', block: 'center' },
    ]);
    expect(scrollIntoView.mock.instances[0]).toBe(
      expectedElement.parentElement
    );
  });

  it('calculates filler height so that the selected item is centered', () => {
    renderScrollableList({ selectedIndex: 0 });
    const fillerHeight = parseFloat(screen.getByTestId('filler').style.height);
    const expectedHeight =
      containerHeight / 2 - itemHeight / activeItemScale / 2;
    expect(fillerHeight).toBe(expectedHeight);
  });

  it('scrolls to the correct item when selectedIndex prop changes', () => {
    const { rerender } = renderScrollableList({ selectedIndex: 0 });
    scrollIntoView.mockClear(); // Clear calls from initial render

    rerender({ selectedIndex: 1 });
    const expectedElement = getTimer(1);

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.calls[0]).toStrictEqual([
      { behavior: 'smooth', block: 'center' },
    ]);
    expect(scrollIntoView.mock.instances[0]).toBe(
      expectedElement.parentElement
    );
  });

  it('recalculates filler height on window resize', () => {
    renderScrollableList({ selectedIndex: 0 });

    const newContainerHeight = 600;
    mockGetBoundingClientRect.mockImplementation(function (this: HTMLElement) {
      const testId = this.getAttribute('data-testid');
      switch (testId) {
        case 'scrollable-list':
          return { height: newContainerHeight } as DOMRect;
        case 'filler':
          return { height: fillerInitialHeight } as DOMRect;
        default:
          return { height: itemHeight } as DOMRect;
      }
    });

    // Simulate resize
    act(() => {
      resizeObserverCallback([], {} as ResizeObserver);
    });

    const filler = screen.getByTestId('filler');
    const newExpectedHeight =
      newContainerHeight / 2 - itemHeight / activeItemScale / 2;
    expect(parseFloat(filler.style.height)).toBe(newExpectedHeight);
  });

  describe('scrolling', () => {
    const mockItemOffsets = () => {
      const items = screen.getAllByTestId(/list-item/);
      let accumulatedOffset = fillerInitialHeight;
      items.forEach((item, index) => {
        const isItemActive = index === 0; // Based on initial selectedIndex
        const currentItemHeight = isItemActive ? activeItemHeight : itemHeight;

        Object.defineProperty(item, 'offsetHeight', {
          value: currentItemHeight,
        });
        Object.defineProperty(item, 'offsetTop', { value: accumulatedOffset });
        accumulatedOffset += currentItemHeight;
      });
    };

    const getItemCenter = (item: HTMLElement) => {
      return item.offsetTop + item.offsetHeight / 2;
    };

    it('selects the item that is in the middle of the container', () => {
      const onSelectedIndexChange = jest.fn();
      renderScrollableList({
        selectedIndex: 0,
        onSelectedIndexChange,
      });
      mockItemOffsets();
      const items = screen.getAllByTestId(/list-item/);

      const indexToSelect = 2;
      const itemCenter = getItemCenter(items[indexToSelect]);
      const targetScrollTop = itemCenter - containerHeight / 2;
      scroll(targetScrollTop);
      expect(onSelectedIndexChange).toHaveBeenCalledWith(2);
    });

    it('selects the item whose center is closest to the viewport center during a scroll', () => {
      const onSelectedIndexChange = jest.fn();
      renderScrollableList({
        selectedIndex: 0,
        onSelectedIndexChange,
      });
      mockItemOffsets();
      const items = screen.getAllByTestId(/list-item/);
      const item2Center = getItemCenter(items[2]);
      const item3Center = getItemCenter(items[3]);
      const midpoint = (item2Center + item3Center) / 2;
      const scrollTopAtMidpoint = midpoint - containerHeight / 2;
      scroll(scrollTopAtMidpoint);
      expect(onSelectedIndexChange).toHaveBeenCalledWith(2);
      scroll(scrollTopAtMidpoint + 1);
      expect(onSelectedIndexChange).toHaveBeenCalledWith(3);
    });
  });
});
