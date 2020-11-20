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

const ToggleButton = styled.label`
  position: relative;
  display: inline-block;
`;

const Wrapper = styled.div`
  height: ${({ theme }) => getToggleHeight(theme)}rem;
  padding: ${({ theme }) => getToggleHeight(theme) * 0.25}rem;
`;

const Span = styled.span`
  position: absolute;
  cursor: pointer;
  width: ${({ theme }) => getToggleWidth(theme)}rem;
  height: ${({ theme }) => getToggleHeight(theme)}rem;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.highlight};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
  opacity: 0.5;
  :before {
    border-radius: 50%;
    position: absolute;
    content: '';
    height: ${({ theme }) => getToggleButtonDiameter(theme)}rem;
    width: ${({ theme }) => getToggleButtonDiameter(theme)}rem;
    left: ${({ theme }) => getToggleButtonMargin(theme)}rem;
    bottom: ${({ theme }) => getToggleButtonMargin(theme)}rem;
    background-color: ${({ theme }) => theme.colors.light};
    -webkit-transition: ${({ theme }) => theme.transition}s;
    transition: ${({ theme }) => theme.transition}s;
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  :checked + ${Span} {
    opacity: 1;
  }
  :checked + ${Span}:before {
    -webkit-transform: translateX(
      ${({ theme }) => getToggleButtonTranslate(theme)}rem
    );
    -ms-transform: translateX(
      ${({ theme }) => getToggleButtonTranslate(theme)}rem
    );
    transform: translateX(${({ theme }) => getToggleButtonTranslate(theme)}rem);
  }
  :focus + ${Span} {
    box-shadow: 0 0 1px ${({ theme }) => theme.colors.highlight};
  }
`;

const Text = styled.span`
  padding-left: ${({ theme }) => getToggleWidth(theme)}rem;
  line-height: ${({ theme }) => getToggleHeight(theme)}rem;
  vertical-align: middle;
`;

export type Props = {
  isOn: boolean;
  setIsOn: (isOn: boolean) => void;
  label: string;
};

const Toggle = ({ isOn, setIsOn, label }: Props) => {
  const onChange = () => {
    setIsOn(!isOn);
  };
  return (
    <Wrapper>
      <ToggleButton>
        <Input type="checkbox" checked={isOn} onChange={onChange} />
        <Span />
      </ToggleButton>
      <Text>{label}</Text>
    </Wrapper>
  );
};

export default Toggle;
