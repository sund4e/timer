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
  const render = (override?: Partial<Props>) => {
    const defaultProps = {
      setNotify: () => {},
      initialShow: true,
      ...override,
    };
    return renderElement(<Toggle {...defaultProps} />);
  };

  let notify = () => {};
  const setNotify = (passed: () => void) => (notify = passed);
  const renderOn = (props?: Partial<Props>) =>
    render({ setNotify, initialShow: true, ...props });
  const renderOff = (props?: Partial<Props>) =>
    render({ setNotify, initialShow: false, ...props });

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

  describe('notify', () => {
    describe('with initialShow', () => {
      it('triggers notification when true', () => {
        renderOn();
        notify();
        expect(notification).toHaveBeenCalled();
      });

      it('does not trigger notification when false', () => {
        renderOff();
        notify();
        expect(notification).not.toHaveBeenCalled();
      });
    });

    it('does not trigger notification if notifications turned off', () => {
      renderOn();
      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);
      notify();
      expect(notification).not.toHaveBeenCalled();
    });

    it('triggers notification if notifications turned on', () => {
      renderOff();
      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);
      notify();
      expect(notification).toHaveBeenCalled();
    });
  });

  describe('When notification permissions are denied', () => {
    beforeAll(() => {
      NotificationMock.permission = 'denied';
    });

    afterAll(() => {
      NotificationMock.permission = 'granted';
    });

    it('does not ask for permission if notifications are turned off', () => {
      renderOff();
      expect(NotificationMock.requestPermission).not.toHaveBeenCalled();
    });

    it('asks for permission when notifications are turned on', () => {
      NotificationMock.requestPermission = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      renderOff();
      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);
      expect(NotificationMock.requestPermission).toHaveBeenCalled();
    });

    it('allows notifications if permissions are granted', async () => {
      NotificationMock.requestPermission = jest
        .fn()
        .mockImplementation(() => Promise.resolve('granted'));
      await act(async () => {
        renderOn();
      });
      notify();
      expect(notification).toHaveBeenCalled();
    });

    it('does not allow notifications if permissions are not granted', async () => {
      NotificationMock.requestPermission = jest
        .fn()
        .mockImplementation(() => Promise.resolve('denied'));
      await act(async () => {
        renderOff();
      });
      notify();
      expect(notification).not.toHaveBeenCalled();
    });
  });
});
