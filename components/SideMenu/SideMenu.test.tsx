import { fireEvent, screen, act, getNodeText } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import SideMenu, { Props } from './SideMenu';
import { getElementWithText } from '../../tests/helpers';

jest.useFakeTimers();

fdescribe('SideMenu', () => {
  const render = (override?: Partial<Props>) => {
    const defaultProps = {
      children: <div></div>,
      ...override,
    };
    const rendered = renderElement(<SideMenu {...defaultProps} />);
  };

  it('renders children', () => {
    const text = 'Happy child';
    render({ children: <div>{text}</div> });
    expect(screen.getByText(text)).toBeDefined();
  });
});
