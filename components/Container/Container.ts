import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.light};
`;

export default Container;
