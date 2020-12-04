import {
  FocusContext,
  FocusContextProvider,
  Props,
  FocusContextType,
} from './FocusContext';
import { act } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';

const createContextGetter = (overrideProps?: Partial<Props>) => {
  const props = {
    initialIndex: 0,
    maxIndex: 5,
    onFocus: () => {},
    allowFocus: true,
    ...overrideProps,
  };

  let context = {} as FocusContextType;
  const Component = (props: Omit<Props, 'children'>) => (
    <FocusContextProvider {...props}>
      <FocusContext.Consumer>
        {(value: FocusContextType) => {
          context = value;
          return <div></div>;
        }}
      </FocusContext.Consumer>
    </FocusContextProvider>
  );
  const renderer = renderElement(<Component {...props} />);
  return () => {
    renderer.rerender(<Component {...props} />);
    return context;
  };
};

describe('FocusContext', () => {
  describe('focusIndex', () => {
    it('is inital index', () => {
      const initialIndex = 2;
      const getContext = createContextGetter({ initialIndex });
      const { focusIndex } = getContext();
      expect(focusIndex).toEqual(initialIndex);
    });

    it('is null if allowFocus is false', () => {
      const initialIndex = 2;
      const getContext = createContextGetter({
        initialIndex,
        allowFocus: false,
      });
      const { focusIndex } = getContext();
      expect(focusIndex).toEqual(null);
    });
  });

  describe('setFocusIndex', () => {
    it('sets focusIndex', () => {
      const initialIndex = 2;
      const newIndex = 1;
      const getContext = createContextGetter({ initialIndex });
      const { setFocusIndex } = getContext();
      act(() => {
        setFocusIndex(newIndex);
      });
      const { focusIndex } = getContext();
      expect(focusIndex).toEqual(newIndex);
    });

    it('sets focus index to null if it is over the maximum', () => {
      const getContext = createContextGetter({ initialIndex: 1, maxIndex: 3 });
      const { setFocusIndex } = getContext();
      act(() => {
        setFocusIndex(5);
      });
      const { focusIndex } = getContext();
      expect(focusIndex).toEqual(null);
    });
  });

  describe('onFocus', () => {
    it('is called if new index is not null', () => {
      const onFocus = jest.fn();
      const getContext = createContextGetter({ onFocus, maxIndex: 3 });
      const { setFocusIndex } = getContext();
      act(() => {
        setFocusIndex(2);
      });
      expect(onFocus).toHaveBeenCalled();
    });

    it('is not called if new index is null', () => {
      const onFocus = jest.fn();
      const getContext = createContextGetter({ onFocus, maxIndex: 3 });
      const { setFocusIndex } = getContext();
      act(() => {
        setFocusIndex(null);
      });
      expect(onFocus).not.toHaveBeenCalled();
    });
  });
});
