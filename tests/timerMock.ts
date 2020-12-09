import { act } from '@testing-library/react';

class MockTimer {
  private time;

  constructor(startTime: number) {
    this.time = startTime;
    jest.useFakeTimers();
    Date.now = jest.fn(() => this.time);
  }

  advanceSecods(seconds: number) {
    this.time = this.time + seconds * 1000;
    Date.now = jest.fn(() => this.time);
    act(() => {
      jest.advanceTimersByTime(seconds * 1000);
    });
  }
}

let timer: MockTimer;

export const mockTime = () => {
  timer = new MockTimer(1487076708000);
};

export const advanceSeconds = (seconds: number) => {
  if (!timer) {
    throw Error('mockTime not set yet');
  }
  timer.advanceSecods(seconds);
};
