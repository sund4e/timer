import styled from 'styled-components';
import { Theme } from '../../styles/theme';

const getToggleWidth = (theme: Theme) => theme.fontSizes.medium * 1.7;

const getToggleHeight = (theme: Theme) => theme.fontSizes.medium;

const getToggleButtonDiameter = (theme: Theme) => theme.fontSizes.medium * 0.7;

const getToggleButtonMargin = (theme: Theme) =>
  (getToggleHeight(theme) - getToggleButtonDiameter(theme)) / 2;

const getToggleButtonTranslate = (theme: Theme) =>
  getToggleWidth(theme) -
  getToggleButtonMargin(theme) * 2 -
  getToggleButtonDiameter(theme);

const getPadding = (theme: Theme) => getToggleHeight(theme) * 0.25;

const ToggleButton = styled.label`
  padding: 0px;
  display: inline-block;
`;

const Wrapper = styled.div`
  height: ${({ theme }) => getToggleHeight(theme)}rem;
  padding: ${({ theme }) => getPadding(theme)}rem;
  display: flex;
`;

const Span = styled.div<{
  $isOn: boolean;
}>`
  position: relative;
  cursor: pointer;
  width: ${({ theme }) => getToggleWidth(theme)}rem;
  height: ${({ theme }) => getToggleHeight(theme)}rem;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.highlight};
  transition: ${({ theme }) => theme.transition}s;
  border-radius: 34px;
  opacity: ${({ $isOn }) => ($isOn ? 1 : 0.5)};
  &:before {
    border-radius: 50%;
    position: absolute;
    content: '';
    height: ${({ theme }) => getToggleButtonDiameter(theme)}rem;
    width: ${({ theme }) => getToggleButtonDiameter(theme)}rem;
    left: ${({ theme }) => getToggleButtonMargin(theme)}rem;
    bottom: ${({ theme }) => getToggleButtonMargin(theme)}rem;
    background-color: ${({ theme }) => theme.colors.light};
    transition: ${({ theme }) => theme.transition}s;
    -webkit-transform: translateX(
      ${({ theme, $isOn }) => ($isOn ? getToggleButtonTranslate(theme) : 0)}rem
    );
    -ms-transform: translateX(
      ${({ theme, $isOn }) => ($isOn ? getToggleButtonTranslate(theme) : 0)}rem
    );
    transform: translateX(
      ${({ theme, $isOn }) => ($isOn ? getToggleButtonTranslate(theme) : 0)}rem
    );
  }
`;

const Input = styled.input`
  display: none;
  :focus + ${Span} {
    box-shadow: 0 0 1px ${({ theme }) => theme.colors.highlight};
  }
`;

const Text = styled.div<{
  $isOn: boolean;
}>`
  padding-left: ${({ theme }) => getPadding(theme)}rem;
  line-height: ${({ theme }) => getToggleHeight(theme)}rem;
  vertical-align: middle;
  opacity: ${({ $isOn }) => ($isOn ? 1 : 0.5)};
  transition: ${({ theme }) => theme.transition}s;
`;

export type Props = {
  isOn: boolean;
  setIsOn: (isOn: boolean) => void;
  children: React.ReactNode;
};

const Toggle = ({ isOn, setIsOn, children }: Props) => {
  const onChange = () => {
    setIsOn(!isOn);
  };
  return (
    <Wrapper>
      <ToggleButton>
        <Input
          type="checkbox"
          data-testid="toggle"
          checked={isOn}
          onChange={onChange}
        />
        <Span $isOn={isOn} />
      </ToggleButton>
      <Text $isOn={isOn}>{children}</Text>
    </Wrapper>
  );
};

export default Toggle;
