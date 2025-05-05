import { act, fireEvent, screen } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import NotificationToggle, { Props } from './NotificationToggle';

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
    const defaultProps: Props = {
      setNotify,
      children: (isDenied: boolean) => 
        <div data-testid="child-content">{`Denied: ${isDenied}`}</div>,
      ...override,
    };
    return renderElement(<NotificationToggle {...defaultProps} />);
  };

  beforeEach(() => {
    // @ts-expect-error Need to mock global Notification type
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

    it('renders toggle on', () => {
      render();
      const toggle = screen.getByTestId('toggle') as HTMLInputElement;
      expect(toggle.checked).toBeTruthy();
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

    it('renders toggle off', () => {
      render();
      const toggle = screen.getByTestId('toggle') as HTMLInputElement;
      expect(toggle.checked).toBeFalsy();
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

    describe('when permissions are granted', () => {
      beforeAll(async () => {
        NotificationMock.requestPermission = jest
          .fn()
          .mockImplementation(() => Promise.resolve('granted'));
        render();
        const toggle = screen.getByTestId('toggle');
        await act(async () => {
          fireEvent.click(toggle);
        });
      });

      it('switches toggle on', async () => {
        const toggle = screen.getByTestId('toggle') as HTMLInputElement;
        expect(toggle.checked).toBeTruthy();
      });
      it('allows notifications', async () => {
        notify();
        expect(notification).toHaveBeenCalled();
      });
    });

    describe('when permissions are not granted', () => {
      beforeAll(async () => {
        NotificationMock.requestPermission = jest
          .fn()
          .mockImplementation(() => Promise.resolve('denied'));
        render();
        const toggle = screen.getByTestId('toggle');
        await act(async () => {
          fireEvent.click(toggle);
        });
      });

      it('does not swtich toggle on', async () => {
        const toggle = screen.getByTestId('toggle') as HTMLInputElement;
        expect(toggle.checked).toBeFalsy();
      });
      it('does not allow notifications', async () => {
        notify();
        expect(notification).not.toHaveBeenCalled();
      });
    });
  });
});
