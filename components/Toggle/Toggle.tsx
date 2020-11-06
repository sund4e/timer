import styled from 'styled-components';

const toggleWidth = '60px';
const toggleHeight = '34px';

const Label = styled.label`
  position: relative;
  display: inline-block;
`;

const Wrapper = styled.div`
  height: ${toggleHeight};
`;

const Span = styled.span`
  position: absolute;
  cursor: pointer;
  width: ${toggleWidth};
  height: ${toggleHeight};
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
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: ${({ theme }) => theme.colors.light};
    -webkit-transition: 0.4s;
    transition: 0.4s;
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
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
  :focus + ${Span} {
    box-shadow: 0 0 1px ${({ theme }) => theme.colors.highlight};
  }
`;

const Text = styled.span`
  position: relative;
  left: ${toggleWidth};
  top: 8px;
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
      <Label>
        <Input type="checkbox" checked={isOn} onChange={onChange} />
        <Span />
      </Label>
      <Text>{label}</Text>
    </Wrapper>
  );
};

export default Toggle;
