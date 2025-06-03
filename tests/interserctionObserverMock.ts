// src/tests/mocks/intersectionObserverMock.ts
class IntersectionObserverMock {
  private callback: IntersectionObserverCallback;
  private options?: IntersectionObserverInit;

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.callback = callback;
    this.options = options;
  }

  observe(target: Element): void {
    // Simulate an immediate intersection for simplicity in tests
    // You might want to make this more configurable if needed
    const entries = [
      {
        target,
        isIntersecting: true,
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRatio: 1,
        intersectionRect: target.getBoundingClientRect(),
        rootBounds:
          this.options?.root instanceof Element
            ? this.options.root.getBoundingClientRect()
            : null,
        time: Date.now(),
      },
    ] as IntersectionObserverEntry[];
    this.callback(entries, this as any);
  }

  unobserve(): void {
    // No-op in this simple mock
  }

  disconnect(): void {
    // No-op in this simple mock
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

export const mockIntersectionObserver = () => {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });
};

export const restoreIntersectionObserver = () => {
  // If you had an original, you might want to restore it,
  // but for JSDOM it's usually not defined.
  delete (window as any).IntersectionObserver;
  delete (global as any).IntersectionObserver;
};
