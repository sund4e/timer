import { act, fireEvent, screen } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import Toggle, { Props } from './NotificationToggle';

const notification = jest.fn();

class NotificationMock {
  static permission = 'granted';
  constructor() {
    notification();
  }

  static requestPermission = jest.fn();
}

describe('NotificationToggle', () => {
  let notify = () => {};
  const setNotify = (passed: () => void) => (notify = passed);

  const render = (override?: Partial<Props>) => {
    const defaultProps = {
      setNotify,
      initialShow: true,
      ...override,
    };
    return renderElement(<Toggle {...defaultProps} />);
  };

  beforeEach(() => {
    //@ts-ignore
    window.Notification = NotificationMock;
  });

  afterEach(() => jest.clearAllMocks());
  it('sets notify', () => {
    const setNotify = jest.fn();
    render({ setNotify });
    expect(setNotify).toHaveBeenCalled();
  });

  describe('when notification permission is granted', () => {
    beforeAll(() => {
      NotificationMock.permission = 'granted';
    });

    afterAll(() => {
      NotificationMock.permission = 'default';
    });

    it('triggers notification by default', () => {
      render();
      notify();
      expect(notification).toHaveBeenCalled();
    });

    it('does not trigger notification if notifications turned off', () => {
      render();
      const toggle = screen.getByTestId('toggle');
      fireEvent.click(toggle);
      notify();
      expect(notification).not.toHaveBeenCalled();
    });

    it('triggers notification if notifications turned on', () => {
      render();
      const toggle = screen.getByTestId('toggle');
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      notify();
      expect(notification).toHaveBeenCalled();
    });
  });

  describe('When notification permissions are not granted', () => {
    it('does not ask for permission if notifications are turned off', () => {
      render();
      expect(NotificationMock.requestPermission).not.toHaveBeenCalled();
    });

    it('asks for permission when notifications are turned on', () => {
      NotificationMock.requestPermission = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      render();
      const toggle = screen.getByTestId('toggle');
      fireEvent.click(toggle);
      expect(NotificationMock.requestPermission).toHaveBeenCalled();
    });

    it('allows notifications if permissions are granted', async () => {
      NotificationMock.requestPermission = jest
        .fn()
        .mockImplementation(() => Promise.resolve('granted'));
      render();
      const toggle = screen.getByTestId('toggle');
      await act(async () => {
        fireEvent.click(toggle);
      });
      notify();
      expect(notification).toHaveBeenCalled();
    });

    it('does not allow notifications if permissions are not granted', async () => {
      NotificationMock.requestPermission = jest
        .fn()
        .mockImplementation(() => Promise.resolve('denied'));
      await act(async () => {
        render();
      });
      notify();
      expect(notification).not.toHaveBeenCalled();
    });
  });
});
