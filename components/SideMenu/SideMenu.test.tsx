import { screen} from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import SideMenu, { Props } from './SideMenu';

jest.useFakeTimers();

describe('SideMenu', () => {
  const render = (override?: Partial<Props>) => {
    const defaultProps = {
      children: <div></div>,
      ...override,
    };
    renderElement(<SideMenu {...defaultProps} />);
  };

  it('renders children', () => {
    const text = 'Happy child';
    render({ children: <div>{text}</div> });
    expect(screen.getByText(text)).toBeDefined();
  });
});
