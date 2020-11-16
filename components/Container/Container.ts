import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.light};
  background-image: url('./luirojarvi.jpg');
  background-size: cover;
  color: ${({ theme }) => theme.colors.primary};
`;

export default Container;
