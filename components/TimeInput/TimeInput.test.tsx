import { fireEvent, screen } from '@testing-library/react';
import { render as renderElement } from '../../tests/render';
import TimeInput, { Props } from './TimeInput';

jest.useFakeTimers();

fdescribe('NumberInput', () => {
  const render = (override?: Partial<Props>) => {
    const defaultProps = {
      value: 6574,
      onChange: () => {},
      onFocus: () => {},
      ...override,
    };
    return renderElement(<TimeInput {...defaultProps} />);
  };
  it('renders value', () => {
    const value = 6574;
    render({ value });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs[0].value).toEqual('0');
    expect(inputs[1].value).toEqual('1');
    expect(inputs[2].value).toEqual('4');
    expect(inputs[3].value).toEqual('9');
    expect(inputs[4].value).toEqual('3');
    expect(inputs[5].value).toEqual('4');
  });

  it('allows focusing on click', () => {
    render();
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const input = inputs[2];
    fireEvent.click(input);
    expect(input === document.activeElement).toBeTruthy();
  });

  it('focuses next input after finishing one', () => {
    render();
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const input = inputs[3];
    fireEvent.change(input, {
      target: {
        value: 5,
      },
    });
    expect(inputs[4] === document.activeElement).toBeTruthy();
  });

  it('calls onFocus upon clicking input', () => {
    const onFocus = jest.fn();
    render({ onFocus });
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.click(inputs[2]);
    expect(onFocus).toHaveBeenCalled();
  });

  describe('onChange', () => {
    it('is called for last input change', () => {
      const onChange = jest.fn();
      render({ onChange });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const input = inputs[inputs.length - 1];
      fireEvent.change(input, {
        target: {
          value: 5,
        },
      });
      expect(onChange).toHaveBeenCalled();
    });
    it('is not called for other than last inputs', () => {
      const onChange = jest.fn();
      render({ onChange });
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      const input = inputs[2];
      fireEvent.change(input, {
        target: {
          value: 5,
        },
      });
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
